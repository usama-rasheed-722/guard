const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateUUID, validatePagination } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protected routes - All authenticated users
router.get('/', authenticateToken, walletController.getWallet);
router.get('/transactions', authenticateToken, validatePagination, walletController.getTransactions);
router.post('/add-funds', authenticateToken, walletController.addFunds);
router.post('/withdraw', authenticateToken, walletController.withdrawFunds);
router.post('/escrow', authenticateToken, authorizeRoles('agency'), walletController.createEscrowTransaction);
router.post('/escrow/:transaction_id/release', authenticateToken, authorizeRoles('admin'), validateUUID('transaction_id'), walletController.releaseEscrowFunds);

module.exports = router;