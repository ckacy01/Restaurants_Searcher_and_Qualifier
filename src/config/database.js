const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using environment configuration.
 * Falls back to local instance if MONGODB_URI is not set.
 * Exits process on connection failure.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 * @date 04 - October - 2025
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tatler_db';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;