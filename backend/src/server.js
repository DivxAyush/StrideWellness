/**
 * Fastify Server Entry Point
 */

const Fastify = require('fastify');
const cors = require('@fastify/cors');
const formbody = require('@fastify/formbody');
const multipart = require('@fastify/multipart');
const jwt = require('@fastify/jwt');

const config = require('./config/env');
const db = require('./config/db');
const logger = require('./utils/logger');
const { initializeFirebase } = require('./config/firebase');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const activityRoutes = require('./modules/activity/activity.routes');
const waterRoutes = require('./modules/water/water.routes');
const goalsRoutes = require('./modules/goals/goals.routes');
const userRoutes = require('./modules/users/user.routes');

const buildServer = async () => {
  const app = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true,
        useDefaults: true,
      },
    },
  });

  // Plugins
  await app.register(cors, {
    origin: '*', // For dev. In prod, specify the origin
  });
  await app.register(formbody);
  await app.register(multipart);

  // JWT configuration
  await app.register(jwt, {
    secret: config.jwtSecret,
    sign: {
      expiresIn: config.jwtExpiration,
    },
  });

  // Custom Decorator for Authentication
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized', message: err.message });
    }
  });

  // Register API Routes
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(activityRoutes, { prefix: '/api/v1/activity' });
  app.register(waterRoutes, { prefix: '/api/v1/water' });
  app.register(goalsRoutes, { prefix: '/api/v1/goals' });
  app.register(userRoutes, { prefix: '/api/v1/users' });

  // Global Error Handler
  app.setErrorHandler((error, request, reply) => {
    logger.error(`Error processing request: ${error.message}`);
    const statusCode = error.statusCode || 500;
    const response = {
      error: error.name || 'Internal Server Error',
      message: error.message,
      ...(config.nodeEnv === 'development' && { stack: error.stack }),
    };
    reply.status(statusCode).send(response);
  });

  return app;
};

const start = async () => {
  try {
    const app = await buildServer();
    await db.connect();
    initializeFirebase();

    await app.listen({ port: config.port, host: '0.0.0.0' });
    logger.info(`Server listening on port ${config.port} in ${config.nodeEnv} mode`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
