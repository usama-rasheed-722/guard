const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateAttendance, validateUUID, validatePagination } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protected routes - Guard only
router.post('/check-in', authenticateToken, authorizeRoles('guard'), upload.single('attendance_photo'), handleUploadError, validateAttendance, attendanceController.checkIn);
router.post('/check-out', authenticateToken, authorizeRoles('guard'), upload.single('attendance_photo'), handleUploadError, validateAttendance, attendanceController.checkOut);

// Protected routes - All authenticated users
router.get('/', authenticateToken, validatePagination, attendanceController.getAttendance);
router.get('/:id', authenticateToken, validateUUID('id'), attendanceController.getAttendanceById);

// Protected routes - Company/Admin only
router.put('/:id/verify', authenticateToken, authorizeRoles('agency', 'admin'), validateUUID('id'), attendanceController.verifyAttendance);

module.exports = router;