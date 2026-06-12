const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema(
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
    totalIntake: {
      type: Number, // in ml
      default: 0,
    },
    dailyGoal: {
      type: Number, // in ml
      default: 4000,
    },
    logs: [
      {
        amount: Number,
        type: { type: String, default: 'quick' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

waterSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Water', waterSchema);
