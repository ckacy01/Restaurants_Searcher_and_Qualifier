
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Vallidation error for Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Invalid ObjectId error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Duplicate key error (e.g., unique fields)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Error: This value must be unique',
    });
  }
  
  // Generic or unhandled errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
};

module.exports = { errorHandler, notFoundHandler };
