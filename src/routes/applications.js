const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protected routes - Guard only
router.post('/jobs', authenticateToken, authorizeRoles('guard'), validateApplication, applicationController.applyForJob);
 
module.exports = router;