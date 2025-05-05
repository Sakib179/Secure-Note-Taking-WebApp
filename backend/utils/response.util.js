// API response formatter 
// Standard response format for API endpoints

// Success response
exports.success = (res, data, message = 'Operation successful', statusCode = 200) => {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  };
  
  // Error response
  exports.error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors })
    });
  };
  
  // Not found response
  exports.notFound = (res, message = 'Resource not found') => {
    return res.status(404).json({
      status: 'error',
      message
    });
  };
  
  // Unauthorized response
  exports.unauthorized = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
      status: 'error',
      message
    });
  };
  
  // Forbidden response
  exports.forbidden = (res, message = 'Access forbidden') => {
    return res.status(403).json({
      status: 'error',
      message
    });
  };