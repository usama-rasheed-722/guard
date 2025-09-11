const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateShiftCreation, validateUUID, validatePagination } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public routes (with optional auth for filtering)
router.get('/', apiLimiter, validatePagination, shiftController.getShifts);
router.get('/:id', apiLimiter, validateUUID('id'), shiftController.getShiftById);

// Protected routes - Company only
router.post('/', authenticateToken, authorizeRoles('agency'), validateShiftCreation, shiftController.createShift);
router.put('/:id', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.updateShift);
router.delete('/:id', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.deleteShift);
router.post('/:id/assign', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.assignGuard);
router.delete('/:id/assign', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.removeGuard);
router.get('/company/my-shifts', authenticateToken, authorizeRoles('agency'), validatePagination, shiftController.getCompanyShifts);

// Protected routes - Guard only
router.get('/guard/my-shifts', authenticateToken, authorizeRoles('guard'), validatePagination, shiftController.getGuardShifts);

module.exports = router;