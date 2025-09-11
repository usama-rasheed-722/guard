const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const jobRoutes = require('./jobs');
const shiftRoutes = require('./shifts');
const applicationRoutes = require('./applications');
const attendanceRoutes = require('./attendance');
const walletRoutes = require('./wallet');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Guard API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Guard API - Security Guard Hiring Platform',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      shifts: '/api/shifts',
      applications: '/api/applications',
      attendance: '/api/attendance',
      wallet: '/api/wallet'
    },
    documentation: 'https://github.com/usama-rasheed-722/guard#api-documentation'
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/shifts', shiftRoutes);
router.use('/applications', applicationRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;