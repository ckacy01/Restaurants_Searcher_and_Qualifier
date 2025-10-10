require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(` ${new Date().toISOString0} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/restaurants', require('../src/routes/restaurants'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    version: '1.1.0',
    timestamp: new Date()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
  console.log(`Health check in http://localhost:${PORT}/api/health`);
  console.log(`Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/tatler_db'}`);
});

module.exports = app;
