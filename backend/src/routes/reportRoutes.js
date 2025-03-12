const express = require('express');
const {
  submitReport,
  getAllReports,
  filterReports,
  getNearbyReports,
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/*
! REMINDER.
- USER:
  - Get past reports.
  - Filter reports.
- ADMIN:
  - Get all reports.
  - Filter reports.
*/

const router = express.Router();
// USER ROUTES
//
// Submit a Report
router.post('/submit', authMiddleware, submitReport);

// ADMIN ROUTES
//
// Get all Reports
router.get('/all', authMiddleware, adminMiddleware, getAllReports);

// Filter Reports
router.get('/filter', authMiddleware, adminMiddleware, filterReports);

// Get reports based on the user's location
router.get('/nearby', authMiddleware, getNearbyReports);

module.exports = router;
