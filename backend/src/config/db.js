/**
 * MongoDB Connection
 */

const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

const connect = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connect };
