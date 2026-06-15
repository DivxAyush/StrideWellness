const waterController = require('./water.controller');

async function waterRoutes(fastify, options) {
  fastify.get('/daily', {
    preValidation: [fastify.authenticate],
  }, waterController.getDailyWater);

  fastify.post('/log', {
    preValidation: [fastify.authenticate],
  }, waterController.logWater);

  fastify.get('/monthly', {
    preValidation: [fastify.authenticate],
  }, waterController.getMonthlyWater);

  fastify.get('/overall', {
    preValidation: [fastify.authenticate],
  }, waterController.getOverallWater);
}

module.exports = waterRoutes;
