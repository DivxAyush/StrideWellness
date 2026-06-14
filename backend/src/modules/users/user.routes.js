const userController = require('./user.controller');

async function userRoutes(fastify, options) {
  fastify.get('/profile', { preValidation: [fastify.authenticate] }, userController.getProfile);
  fastify.put('/profile', { preValidation: [fastify.authenticate] }, userController.updateProfile);
}

module.exports = userRoutes;
