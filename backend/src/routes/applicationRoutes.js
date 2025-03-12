// All the routes under /applications are defined here
// The routes are used to submit an application, get application status, approve an application and reject an application

const express = require('express');
const {
  submitApplication,
  getApplicationStatus,
  approveApplication,
  rejectApplication,
  getAllApplications,
  deleteApplication,
  getApplicationById,
  updateApplication,
} = require('../controllers/applicationController');
const upload = require('../middleware/upload');

// Importing authentication middleware to protect routes
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// USER ROUTES
//
// Route for submitting application with file uploads
router.post(
  '/apply',
  upload.fields([
    { name: 'idAttachment', maxCount: 1 },
    { name: 'pinAttachment', maxCount: 1 },
  ]),
  submitApplication
);

// Route to get application status by application ID
router.get('/status/:id', getApplicationStatus);

// ADMIN ROUTES
//
// Route to approve an application (Admin only)
router.patch('/approve/:id', authMiddleware, approveApplication);

// Route to reject an application (Admin only)
router.post('/reject/:id', authMiddleware, rejectApplication);

// Route to fetch all applications (Admin only)
router.get('/all', authMiddleware, getAllApplications);

// Route to fetch an application by ID (Admin only)
router.get('/:id', authMiddleware, getApplicationById);

// Route to update an application by ID (Admin only)
router.patch('/update/:id', authMiddleware, updateApplication);

// Route to delete an application (Admin only)
router.delete('/delete/:id', authMiddleware, deleteApplication);

module.exports = router;
