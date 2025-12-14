const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Run every minute to check for upcoming tasks
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    // Find tasks starting in the next 30 minutes that haven't been notified
    const tasks = await Task.find({
      startTime: {
        $gte: now,
        $lte: thirtyMinutesFromNow,
      },
      "reminders.email": true,
      notificationSent: { $ne: true },
    }).populate("user");

    for (const task of tasks) {
      try {
        // Send email notification
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: task.user.email,
          subject: `⏰ Upcoming Task: ${task.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Task Starting Soon</h2>
              <p>Hello ${task.user.name},</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${task.title}</h3>
                <p>${task.description || "No description provided"}</p>
                
                <div style="margin: 15px 0;">
                  <p><strong>Starts in:</strong> 30 minutes</p>
                  <p><strong>Start Time:</strong> ${new Date(
                    task.startTime
                  ).toLocaleString()}</p>
                  <p><strong>End Time:</strong> ${new Date(
                    task.endTime
                  ).toLocaleString()}</p>
                </div>
              </div>
              
              <div style="margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL}/task/${task._id}" 
                   style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Task
                </a>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);

        // Mark as notified
        task.notificationSent = true;
        await task.save();

        console.log(`✅ Sent notification for task: ${task.title}`);
      } catch (error) {
        console.error(
          `❌ Failed to send notification for task ${task._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});

// Daily summary email at 8 AM
cron.schedule("0 8 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const users = await User.find({ "notificationPreferences.email": true });

    for (const user of users) {
      try {
        const tasks = await Task.find({
          user: user._id,
          startTime: {
            $gte: today,
            $lt: tomorrow,
          },
        });

        if (tasks.length > 0) {
          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `📅 Daily Task Summary - ${new Date().toLocaleDateString()}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Your Tasks for Today</h2>
                <p>Hello ${user.name},</p>
                <p>Here are your tasks scheduled for today:</p>
                
                ${tasks
                  .map(
                    (task) => `
                  <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #4F46E5;">
                    <h3 style="margin-top: 0;">${task.title}</h3>
                    <p><strong>Time:</strong> ${new Date(
                      task.startTime
                    ).toLocaleTimeString()} - ${new Date(
                      task.endTime
                    ).toLocaleTimeString()}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                  </div>
                `
                  )
                  .join("")}
                
                <div style="margin-top: 30px; text-align: center;">
                  <a href="${process.env.FRONTEND_URL}" 
                     style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log(`✅ Sent daily summary to ${user.email}`);
        }
      } catch (error) {
        console.error(
          `❌ Failed to send daily summary to ${user.email}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("❌ Daily summary cron error:", error);
  }
});

console.log("⏰ Cron jobs initialized");
