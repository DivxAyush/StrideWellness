const admin = require('firebase-admin');
const config = require('./env');
const logger = require('../utils/logger');

const initializeFirebase = () => {
  try {
    if (!config.firebaseServiceAccount) {
      logger.warn('Firebase Service Account path not provided. FCM and Firebase Auth will be disabled.');
      return;
    }

    const serviceAccount = require(config.firebaseServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    logger.info('Firebase Admin SDK Initialized Successfully');
  } catch (error) {
    logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
};

module.exports = {
  admin,
  initializeFirebase
};
