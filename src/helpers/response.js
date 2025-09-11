// Success response helper
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

// Error response helper
const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

// Pagination response helper
const paginatedResponse = (res, message, data, pagination, statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1
    }
  };

  return res.status(statusCode).json(response);
};

// Validation error response helper
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array ? errors.array() : errors
  });
};

// Server error response helper
const serverErrorResponse = (res, message = 'Internal server error', error = null) => {
  const response = {
    success: false,
    message
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
    response.stack = error.stack;
  }

  return res.status(500).json(response);
};

// Not found response helper
const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

// Unauthorized response helper
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message
  });
};

// Forbidden response helper
const forbiddenResponse = (res, message = 'Forbidden access') => {
  return res.status(403).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse
};