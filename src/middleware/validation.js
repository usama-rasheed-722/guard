const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'agency', 'guard'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Job validation rules
const validateJobCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('date')
    .isISO8601()
    .toDate()
    .withMessage('Valid date is required'),
  body('start_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time is required (HH:MM format)'),
  body('end_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time is required (HH:MM format)'),
  body('hourly_rate')
    .isDecimal({ decimal_digits: '0,2' })
    .isFloat({ min: 0 })
    .withMessage('Valid hourly rate is required'),
  body('company_location_id')
    .optional()
    .isUUID()
    .withMessage('company_location_id must be a valid UUID'),
  body('required_guards')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Required guards must be a positive integer'),
  handleValidationErrors
];

// Shift validation rules
const validateShiftCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('start_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time is required (HH:MM format)'),
  body('end_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time is required (HH:MM format)'),
  body('days_of_week')
    .isArray({ min: 1 })
    .withMessage('At least one day of the week is required'),
  body('days_of_week.*')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of the week'),
  body('hourly_rate')
    .isDecimal({ decimal_digits: '0,2' })
    .isFloat({ min: 0 })
    .withMessage('Valid hourly rate is required'),
  body('start_date')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),
  handleValidationErrors
];

// Application validation rules
const validateApplication = [
  body('bid_rate')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .isFloat({ min: 0 })
    .withMessage('Valid bid rate is required'),
  body('cover_letter')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Cover letter must not exceed 1000 characters'),
  handleValidationErrors
];

// Attendance validation rules
const validateAttendance = [
  body('latitude')
    .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('longitude')
    .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  handleValidationErrors
];

// Feedback validation rules
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comments must not exceed 500 characters'),
  handleValidationErrors
];

// UUID parameter validation
const validateUUID = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`Valid ${paramName} is required`),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateJobCreation,
  validateShiftCreation,
  validateApplication,
  validateAttendance,
  validateFeedback,
  validateUUID,
  validatePagination
};