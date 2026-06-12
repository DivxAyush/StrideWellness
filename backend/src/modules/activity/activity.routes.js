const activityController = require('./activity.controller');

async function activityRoutes(fastify, options) {
  fastify.get('/daily', {
    preValidation: [fastify.authenticate],
  }, activityController.getDailyActivity);

  fastify.post('/sync', {
    preValidation: [fastify.authenticate],
  }, activityController.syncActivity);
}

module.exports = activityRoutes;
