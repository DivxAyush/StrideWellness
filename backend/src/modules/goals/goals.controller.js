const Goal = require('./goals.model');

// @desc    Get all user goals
// @route   GET /api/v1/goals
// @access  Private
exports.getGoals = async (request, reply) => {
  try {
    const goals = await Goal.find({ user: request.user.id });
    reply.send({ success: true, data: goals });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/v1/goals
// @access  Private
exports.createGoal = async (request, reply) => {
  try {
    const { title, type, target, unit, icon, color } = request.body;

    const goal = await Goal.create({
      user: request.user.id,
      title,
      type,
      target,
      unit,
      icon,
      color,
    });

    reply.status(201).send({ success: true, data: goal });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/v1/goals/:id
// @access  Private
exports.updateGoal = async (request, reply) => {
  try {
    const { id } = request.params;
    const updateData = request.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: request.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return reply.status(404).send({ success: false, error: 'Goal not found' });
    }

    reply.send({ success: true, data: goal });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};
