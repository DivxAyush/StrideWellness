const User = require('./user.model');
const logger = require('../../utils/logger');
const crypto = require('crypto');
const { admin } = require('../../config/firebase');

// Generate Tokens
const generateTokens = async (fastify, user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = fastify.jwt.sign(payload);
  const refreshToken = fastify.jwt.sign(payload, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (request, reply) => {
  try {
    const { name, email, password } = request.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return reply.status(400).send({
        success: false,
        error: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const tokens = await generateTokens(request.server, user);

    reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    // Validate email & password
    if (!email || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const tokens = await generateTokens(request.server, user);

    reply.send({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id);
    
    if (!user) {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }

    reply.send({
      success: true,
      data: user,
    });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Firebase Login / Signup
// @route   POST /api/v1/auth/firebase-login
// @access  Public
exports.firebaseLogin = async (request, reply) => {
  try {
    const { token } = request.body;

    if (!token) {
      return reply.status(400).send({ success: false, error: 'Firebase ID token is required' });
    }

    // Verify Firebase Token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      logger.error(`Firebase token verification failed: ${err.message}`);
      return reply.status(401).send({ success: false, error: 'Invalid Firebase token' });
    }

    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return reply.status(400).send({ success: false, error: 'Email not found in Firebase token' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one automatically
    if (!user) {
      user = await User.create({
        name: name || 'User',
        email: email,
        password: crypto.randomBytes(16).toString('hex'), // Random password since auth is via Firebase
        avatar: picture || null,
      });
      logger.info(`New user registered via Firebase: ${email}`);
    }

    // Generate JWT tokens for our backend
    const tokens = await generateTokens(request.server, user);

    reply.send({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error(`Firebase login error: ${error.message}`);
    reply.status(500).send({ success: false, error: error.message });
  }
};
