const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { google } = require('googleapis');
const User = require('../models/User');
const Task = require('../models/Task');

// Initialize Google Calendar API
const calendar = google.calendar('v3');

// Connect to Google Calendar
router.post('/connect', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Store Google tokens (simplified - in real app, use OAuth flow)
    user.calendarIntegration.enabled = true;
    user.googleAccessToken = req.body.accessToken;
    user.googleRefreshToken = req.body.refreshToken;
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Google Calendar connected successfully' 
    });
  } catch (error) {
    console.error('Calendar connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect Google Calendar' 
    });
  }
});

// Sync task to Google Calendar
router.post('/sync-task/:taskId', auth, async (req, res) => {
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
    
    if (!user.googleAccessToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please connect Google Calendar first' 
      });
    }
    
    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });
    
    // Create calendar event
    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: task.endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: task.attendees.map(attendee => ({
        email: attendee.email
      })),
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'email',
            minutes: task.reminders.minutesBefore
          },
          {
            method: 'popup',
            minutes: task.reminders.minutesBefore
          }
        ]
      }
    };
    
    let calendarEvent;
    
    if (task.googleCalendarEventId) {
      // Update existing event
      calendarEvent = await calendar.events.update({
        auth: oAuth2Client,
        calendarId: user.calendarIntegration.calendarId || 'primary',
        eventId: task.googleCalendarEventId,
        resource: event,
        sendUpdates: 'all'
      });
    } else {
      // Create new event
      calendarEvent = await calendar.events.insert({
        auth: oAuth2Client,
        calendarId: user.calendarIntegration.calendarId || 'primary',
        resource: event,
        sendUpdates: 'all'
      });
      
      task.googleCalendarEventId = calendarEvent.data.id;
      task.isSyncedWithGoogle = true;
      await task.save();
    }
    
    res.json({ 
      success: true, 
      message: 'Task synced with Google Calendar',
      eventId: calendarEvent.data.id,
      htmlLink: calendarEvent.data.htmlLink
    });
    
  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to sync with Google Calendar' 
    });
  }
});

// Get upcoming calendar events
router.get('/events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.googleAccessToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google Calendar not connected' 
      });
    }
    
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });
    
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const events = await calendar.events.list({
      auth: oAuth2Client,
      calendarId: user.calendarIntegration.calendarId || 'primary',
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    res.json({ 
      success: true, 
      events: events.data.items 
    });
    
  } catch (error) {
    console.error('Calendar fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch calendar events' 
    });
  }
});

module.exports = router;
