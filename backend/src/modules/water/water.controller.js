const Water = require('./water.model');

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

    if (!water) {
      // Create one on the fly if it doesn't exist for today yet
      water = await Water.create({
        user: request.user.id,
        date: targetDate,
        totalIntake: 0,
        dailyGoal: 4000,
        logs: [],
      });
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

    if (!water) {
      water = await Water.create({
        user: request.user.id,
        date: targetDate,
        totalIntake: amount,
        dailyGoal: 4000,
        logs: [{ amount, type }],
      });
    } else {
      water.totalIntake += amount;
      water.logs.unshift({ amount, type, timestamp: new Date() });
      await water.save();
    }

    reply.send({ success: true, data: water });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};
