const express = require('express');
const {
  submitReport,
  getAllReports,
  filterReports,
  getNearbyReports,
  updateReportStatus,
  getReportStatus,
  getPastReports,
  filterUserReports,
  requestReportReopen,
  approveReopenRequest,
  searchReports,
  exportReports,
} = require('../controllers/reportController');
const { assignReport } = require('../controllers/assignReport');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/*
! REMINDER.
- Make sure that you can't reassign a report that is already assigned to another admin and that you can't assign to the same admin again.
EXPORT:
- Sort reports before exporting
- Allow selection of specific fields
- Better formatting for PDF tables

*/

const router = express.Router();

// USER ROUTES
//
// Submit a Report
router.post('/submit', authMiddleware, submitReport);

// Get status of their own report.
router.get('/status/:id', authMiddleware, getReportStatus);

// Get all their past reports
router.get('/my-reports', authMiddleware, getPastReports);

// Filter past reports based on status, category, or priority
router.get('/my-reports/filter', authMiddleware, filterUserReports);

// Request to reopen a report
router.post('/reopen-request/:id', authMiddleware, requestReportReopen);

// USER AND ADMIN ROUTES
//
// Search reports
router.get('/search', authMiddleware, searchReports);

// Download a report
router.get('/export', authMiddleware, exportReports);

// ADMIN ROUTES
//
// Get all Reports
router.get('/all', authMiddleware, adminMiddleware, getAllReports);

// Get status of a report (Admin only)
router.get('/status/:id', authMiddleware, adminMiddleware, getReportStatus);

// Filter Reports
router.get('/filter', authMiddleware, adminMiddleware, filterReports);

// Get reports based on the user's location
router.get('/nearby', authMiddleware, adminMiddleware, getNearbyReports);

// Update report status (Admin only)
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  updateReportStatus
);

// Reopen approval request (Admin only)
router.put(
  '/reopen-approval/:id',
  authMiddleware,
  adminMiddleware,
  approveReopenRequest
);

// Route to assign a report to another admin
router.patch(
  '/:reportId/assign',
  authMiddleware,
  adminMiddleware,
  assignReport
);

module.exports = router;
