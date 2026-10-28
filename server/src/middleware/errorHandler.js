/**
 * Centralized error handling middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Log error details in development
  if (process.env.NODE_ENV !== 'test') {
    console.error('API Error:', {
      name: err.name,
      message: err.message,
      code: err.code,
      path: req.originalUrl,
    });
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Employee not found with ID: ${err.value}`,
      errorType: 'CastError',
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return res.status(409).json({
      success: false,
      message: `An employee with the ${field} "${value}" already exists. Please use a unique ${field}.`,
      field,
      errorType: 'DuplicateKeyError',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: errors.join('. '),
      errors,
      errorType: 'ValidationError',
    });
  }

  // Database disconnected error
  if (err.name === 'MongooseServerSelectionError' || err.message?.includes('buffering timed out')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is unavailable. Please verify that MongoDB is running and MONGODB_URI is correctly configured.',
      errorType: 'DatabaseConnectionError',
    });
  }

  // Default to 500 Internal Server Error
  const statusCode = error.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'An unexpected server error occurred',
  });
};

module.exports = errorHandler;
