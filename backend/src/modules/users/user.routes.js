const userController = require('./user.controller');

async function userRoutes(fastify, options) {
  fastify.get('/profile', { preValidation: [fastify.authenticate] }, userController.getProfile);
  fastify.put('/profile', { preValidation: [fastify.authenticate] }, userController.updateProfile);
  fastify.delete('/me', { preValidation: [fastify.authenticate] }, userController.deleteAccount);
}

module.exports = userRoutes;
