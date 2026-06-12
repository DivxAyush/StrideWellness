/**
 * Environment Configuration
 */

require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/stridewellness',
  jwtSecret: process.env.JWT_SECRET || 'stride_super_secret_key_change_me_in_prod',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
};
