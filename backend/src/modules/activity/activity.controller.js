const Activity = require('./activity.model');
const Goal = require('../goals/goals.model');

// @desc    Get daily activity
// @route   GET /api/v1/activity/daily?date=YYYY-MM-DD
// @access  Private
exports.getDailyActivity = async (request, reply) => {
  try {
    const { date } = request.query;
    
    // Default to today if no date provided
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let activity = await Activity.findOne({
      user: request.user.id,
      date: targetDate,
    });

    let stepGoal = 10000;
    const goalDoc = await Goal.findOne({ user: request.user.id, type: 'steps' });
    if (goalDoc) {
      stepGoal = goalDoc.target;
    }

    // If no activity exists for today, return a default mock object for the UI to display
    if (!activity) {
      return reply.send({
        success: true,
        data: {
          steps: 0,
          goalSteps: stepGoal,
          calories: 0,
          distance: 0,
          activeTime: 0,
          intensity: '0:00',
          hourlyData: [],
        },
      });
    }

    // Mix in goal steps (fetched from user goals)
    const data = activity.toObject();
    data.goalSteps = stepGoal;

    reply.send({ success: true, data });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Sync daily activity (create or update)
// @route   POST /api/v1/activity/sync
// @access  Private
exports.syncActivity = async (request, reply) => {
  try {
    const { date, steps, calories, distance, activeTime, intensity, hourlyData } = request.body;
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let activity = await Activity.findOne({
      user: request.user.id,
      date: targetDate,
    });

    if (activity) {
      activity.steps = steps || activity.steps;
      activity.calories = calories || activity.calories;
      activity.distance = distance || activity.distance;
      activity.activeTime = activeTime || activity.activeTime;
      activity.intensity = intensity || activity.intensity;
      if (hourlyData) activity.hourlyData = hourlyData;
      
      await activity.save();
    } else {
      activity = await Activity.create({
        user: request.user.id,
        date: targetDate,
        steps,
        calories,
        distance,
        activeTime,
        intensity,
        hourlyData,
      });
    }

    reply.send({ success: true, data: activity });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Get monthly activity summary
// @route   GET /api/v1/activity/monthly?month=YYYY-MM
// @access  Private
exports.getMonthlyActivity = async (request, reply) => {
  try {
    const { month } = request.query;
    const targetMonth = month ? new Date(month) : new Date();
    
    const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    const activities = await Activity.find({
      user: request.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    reply.send({ success: true, data: activities });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Get overall activity summary
// @route   GET /api/v1/activity/overall
// @access  Private
exports.getOverallActivity = async (request, reply) => {
  try {
    const activities = await Activity.find({
      user: request.user.id,
    }).sort({ date: 1 });

    // Aggregate by month or just return all
    reply.send({ success: true, data: activities });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};
