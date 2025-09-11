const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateJobCreation, validateUUID, validatePagination } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public routes (with optional auth for filtering)
router.get('/', apiLimiter, validatePagination, jobController.getJobs);
router.get('/:id', apiLimiter, validateUUID('id'), jobController.getJobById);

// Protected routes - Company only
router.post('/', authenticateToken, authorizeRoles('agency'), validateJobCreation, jobController.createJob);
router.put('/:id', authenticateToken, authorizeRoles('agency'), validateUUID('id'), jobController.updateJob);
router.delete('/:id', authenticateToken, authorizeRoles('agency'), validateUUID('id'), jobController.deleteJob);
router.get('/company/my-jobs', authenticateToken, authorizeRoles('agency'), validatePagination, jobController.getCompanyJobs);

module.exports = router;