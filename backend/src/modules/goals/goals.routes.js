const goalsController = require('./goals.controller');

async function goalsRoutes(fastify, options) {
  fastify.get('/', {
    preValidation: [fastify.authenticate],
  }, goalsController.getGoals);

  fastify.post('/', {
    preValidation: [fastify.authenticate],
  }, goalsController.createGoal);

  fastify.put('/:id', {
    preValidation: [fastify.authenticate],
  }, goalsController.updateGoal);
}

module.exports = goalsRoutes;
