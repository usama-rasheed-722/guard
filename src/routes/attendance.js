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
router.get('/me/jobs/:job_id', authenticateToken, authorizeRoles('guard'), validatePagination, attendanceController.getMyAttendanceForJob);
router.get('/me/shifts/:shift_id', authenticateToken, authorizeRoles('guard'), validatePagination, attendanceController.getMyAttendanceForShift);
router.get('/me/detail', authenticateToken, authorizeRoles('guard'), attendanceController.getMyAttendanceDetail);

// Attendance detail: agency sets alarm; guard pings
router.post('/alarms', authenticateToken, authorizeRoles('agency', 'admin'), attendanceController.setAttendanceAlarm);
router.post('/ping', authenticateToken, authorizeRoles('guard'), attendanceController.pingAttendance);

// Protected routes - All authenticated users
router.get('/', authenticateToken, validatePagination, attendanceController.getAttendance);
router.get('/:id', authenticateToken, validateUUID('id'), attendanceController.getAttendanceById);

// Protected routes - Company/Admin only
router.put('/:id/verify', authenticateToken, authorizeRoles('agency', 'admin'), validateUUID('id'), attendanceController.verifyAttendance);
router.get('/agency/list', authenticateToken, authorizeRoles('agency', 'admin'), validatePagination, attendanceController.getAgencyAttendance);
router.get('/agency/detail/:id', authenticateToken, authorizeRoles('agency', 'admin'), validateUUID('id'), attendanceController.getAttendanceDetail);

module.exports = router;