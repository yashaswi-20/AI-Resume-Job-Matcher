/**
 * Global error handler middleware.
 * Must be registered LAST in Express middleware chain.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const body = {
    success: false,
    error: message,
  };

  // Expose stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  // Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'File too large. Max 5MB allowed.' });
  }

  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: errors.join(', ') });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  return res.status(statusCode).json(body);
}

module.exports = errorHandler;
