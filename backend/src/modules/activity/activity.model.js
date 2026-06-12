const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    steps: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number, // in km
      default: 0,
    },
    activeTime: {
      type: Number, // in minutes
      default: 0,
    },
    intensity: {
      type: String, // format like "9:45" min/km
      default: '0:00',
    },
    hourlyData: [
      {
        hour: Number,
        steps: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure a user only has one activity record per day
activitySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', activitySchema);
