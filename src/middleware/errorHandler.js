/**
 * Error Handler Module - Centralized error handling for the application.
 * 
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 * @date 10 - October - 2025
 */

/**
 * Middleware for handling and formatting errors with appropriate HTTP status codes.
 * Handles validation errors, casting errors, duplicate key errors, and generic errors.
 * 
 * @async
 * @function errorHandler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Error: This value must be unique'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

/**
 * Middleware for handling 404 Not Found errors when no route matches.
 * 
 * @function notFoundHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
};

module.exports = { errorHandler, notFoundHandler };
