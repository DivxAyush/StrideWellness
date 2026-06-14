const authController = require('./auth.controller');

async function authRoutes(fastify, options) {
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/firebase-login', authController.firebaseLogin);

  fastify.get('/me', {
    preValidation: [fastify.authenticate],
  }, authController.getMe);
}

module.exports = authRoutes;
