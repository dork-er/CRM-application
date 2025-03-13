const express = require('express');
const {
  respondToResponse,
  adminRespondToReport,
  getResponsesForReport,
  editResponse,
} = require('../controllers/reportResponseController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

/*
! IMPORTANT
- Add a route for admins to fetch all responses.
- Add a route for admins to fetch all responses for a specific report.
- Add a route for admins to edit any response.
- Add a route for admins to delete any response.
- Add a route for users to delete their feedback.
- Add a route for admins to delete user feedback.
- Add a route for users to report a response.
- Add a route for admins to view all reported responses.
- Add a route for admins to delete a reported response.
*/

// ? USER ROUTES
//
// Route to add a comment to a response (user)
router.post('/:responseId/respond', authMiddleware, respondToResponse);

// Route to get all responses for a report
router.get('/:reportId/responses', authMiddleware, getResponsesForReport);

//? BOTH USER AND ADMIN ROUTES
// Route to edit a response.
// Users can edit their feedback but only within one hour of posting.
// Admins can edit any response but not user feedback.
router.put('/:responseId/edit', authMiddleware, editResponse);

// ? ADMIN ROUTES
//
//Route to add a response to a report (admin)
router.post(
  '/:reportId/admin-respond',
  authMiddleware,
  adminMiddleware,
  adminRespondToReport
);

module.exports = router;
