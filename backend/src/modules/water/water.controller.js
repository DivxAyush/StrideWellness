const Water = require('./water.model');
const Goal = require('../goals/goals.model');

// @desc    Get daily water intake
// @route   GET /api/v1/water/daily?date=YYYY-MM-DD
// @access  Private
exports.getDailyWater = async (request, reply) => {
  try {
    const { date } = request.query;
    
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let water = await Water.findOne({
      user: request.user.id,
      date: targetDate,
    });

    let waterGoal = 4000;
    const goalDoc = await Goal.findOne({ user: request.user.id, type: 'water' });
    if (goalDoc) {
      waterGoal = goalDoc.target * 1000; // convert L to ml
    }

    if (!water) {
      // Create one on the fly if it doesn't exist for today yet
      water = await Water.create({
        user: request.user.id,
        date: targetDate,
        totalIntake: 0,
        dailyGoal: waterGoal,
        logs: [],
      });
    } else if (water.dailyGoal !== waterGoal) {
      water.dailyGoal = waterGoal;
      await water.save();
    }

    reply.send({ success: true, data: water });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Log water intake
// @route   POST /api/v1/water/log
// @access  Private
exports.logWater = async (request, reply) => {
  try {
    const { amount, type } = request.body;
    
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);

    let water = await Water.findOne({
      user: request.user.id,
      date: targetDate,
    });

    let waterGoal = 4000;
    const goalDoc = await Goal.findOne({ user: request.user.id, type: 'water' });
    if (goalDoc) {
      waterGoal = goalDoc.target * 1000; // convert L to ml
    }

    if (!water) {
      water = await Water.create({
        user: request.user.id,
        date: targetDate,
        totalIntake: amount,
        dailyGoal: waterGoal,
        logs: [{ amount, type, timestamp: new Date() }],
      });
    } else {
      water.totalIntake += amount;
      water.dailyGoal = waterGoal;
      water.logs.unshift({ amount, type, timestamp: new Date() });
      await water.save();
    }

    reply.send({ success: true, data: water });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Get monthly water intake summary
// @route   GET /api/v1/water/monthly?month=YYYY-MM
// @access  Private
exports.getMonthlyWater = async (request, reply) => {
  try {
    const { month } = request.query;
    const targetMonth = month ? new Date(month) : new Date();
    
    const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    const waterLogs = await Water.find({
      user: request.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    reply.send({ success: true, data: waterLogs });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Get overall water intake summary
// @route   GET /api/v1/water/overall
// @access  Private
exports.getOverallWater = async (request, reply) => {
  try {
    const waterLogs = await Water.find({
      user: request.user.id,
    }).sort({ date: 1 });

    reply.send({ success: true, data: waterLogs });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};
