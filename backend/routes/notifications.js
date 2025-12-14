const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const Task = require('../models/Task');
const User = require('../models/User');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send task notification
router.post('/send/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user.id
    }).populate('user');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    const user = task.user;
    
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Task Reminder: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Task Reminder</h2>
          <p>Hello ${user.name},</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${task.title}</h3>
            <p>${task.description || 'No description provided'}</p>
            
            <div style="margin: 15px 0;">
              <p><strong>Start Time:</strong> ${new Date(task.startTime).toLocaleString()}</p>
              <p><strong>End Time:</strong> ${new Date(task.endTime).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: ${task.status === 'completed' ? '#10b981' : task.status === 'in-progress' ? '#f59e0b' : '#ef4444'}">${task.status}</span></p>
            </div>
          </div>
          
          <p>This task has been added to your Google Calendar. You'll receive notifications before it starts.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from Task Management App.<br>
              You can manage your notification preferences in your account settings.
            </p>
          </div>
        </div>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send emails to attendees
    for (const attendee of task.attendees) {
      const attendeeMailOptions = {
        from: process.env.EMAIL_FROM,
        to: attendee.email,
        subject: `You're invited: ${task.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Meeting Invitation</h2>
            <p>Hello,</p>
            <p>${user.name} has invited you to:</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${task.title}</h3>
              <p>${task.description || 'No description provided'}</p>
              
              <div style="margin: 15px 0;">
                <p><strong>Start Time:</strong> ${new Date(task.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(task.endTime).toLocaleString()}</p>
                <p><strong>Organizer:</strong> ${user.name} (${user.email})</p>
              </div>
            </div>
            
            <p>This event has been added to your Google Calendar.</p>
            
            <div style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL}/task/${task._id}" 
                 style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Task Details
              </a>
            </div>
          </div>
        `
      };
      
      try {
        await transporter.sendMail(attendeeMailOptions);
      } catch (emailError) {
        console.error(`Failed to send email to ${attendee.email}:`, emailError);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Notifications sent successfully' 
    });
    
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notifications' 
    });
  }
});

module.exports = router;
