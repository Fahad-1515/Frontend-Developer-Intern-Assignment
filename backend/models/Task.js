const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  googleCalendarEventId: {
    type: String,
    default: null
  },
  attendees: [{
    email: String,
    responseStatus: {
      type: String,
      enum: ['needsAction', 'declined', 'tentative', 'accepted'],
      default: 'needsAction'
    }
  }],
  reminders: {
    email: {
      type: Boolean,
      default: true
    },
    notification: {
      type: Boolean,
      default: true
    },
    minutesBefore: {
      type: Number,
      default: 30
    }
  },
  isSyncedWithGoogle: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ user: 1, startTime: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ googleCalendarEventId: 1 });

module.exports = mongoose.model('Task', taskSchema);
