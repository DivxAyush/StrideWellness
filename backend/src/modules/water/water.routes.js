const waterController = require('./water.controller');

async function waterRoutes(fastify, options) {
  fastify.get('/daily', {
    preValidation: [fastify.authenticate],
  }, waterController.getDailyWater);

  fastify.post('/log', {
    preValidation: [fastify.authenticate],
  }, waterController.logWater);
}

module.exports = waterRoutes;
