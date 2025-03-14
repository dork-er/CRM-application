const express = require('express');
const {
  getDashboardReportStats,
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get(
  '/report-stats',
  authMiddleware,
  adminMiddleware,
  getDashboardReportStats
);

module.exports = router;
