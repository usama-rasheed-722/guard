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
router.delete('/:id/assign/:assignment_id', authenticateToken, authorizeRoles('agency'), validateUUID('id'), validateUUID('assignment_id'), shiftController.removeGuard);
router.get('/:id/assignments', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.getShiftAssignments);
router.get('/:id/guards/count', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.getShiftGuardCount);
router.get('/:id/guards', authenticateToken, authorizeRoles('agency'), validateUUID('id'), shiftController.getShiftGuards);
router.get('/company/my-shifts', authenticateToken, authorizeRoles('agency'), validatePagination, shiftController.getCompanyShifts);

// Protected routes - Guard only
router.get('/guard/my-shifts', authenticateToken, authorizeRoles('guard'), validatePagination, shiftController.getGuardShifts);
router.put('/:id/assignments/:assignment_id/status', authenticateToken, authorizeRoles('guard'), validateUUID('id'), validateUUID('assignment_id'), shiftController.updateAssignmentStatus);

module.exports = router;