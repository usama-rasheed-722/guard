const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateApplication, validateUUID, validatePagination } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protected routes - Guard only
router.post('/jobs', authenticateToken, authorizeRoles('guard'), validateApplication, applicationController.applyForJob);
router.post('/shifts', authenticateToken, authorizeRoles('guard'), validateApplication, applicationController.applyForShift);
router.get('/guard/my-applications', authenticateToken, authorizeRoles('guard'), validatePagination, applicationController.getGuardApplications);

// Protected routes - Company only
router.get('/jobs/:job_id', authenticateToken, authorizeRoles('agency'), validateUUID('job_id'), validatePagination, applicationController.getJobApplications);
router.get('/shifts/:shift_id', authenticateToken, authorizeRoles('agency'), validateUUID('shift_id'), validatePagination, applicationController.getShiftApplications);
router.put('/:id/accept', authenticateToken, authorizeRoles('agency'), validateUUID('id'), applicationController.acceptApplication);
router.put('/:id/reject', authenticateToken, authorizeRoles('agency'), validateUUID('id'), applicationController.rejectApplication);

module.exports = router;