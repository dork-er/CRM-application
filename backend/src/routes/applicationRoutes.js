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

const router = express.Router();

// Route for submitting application with file uploads
router.post(
  '/apply',
  upload.fields([
    { name: 'idAttachment', maxCount: 1 },
    { name: 'pinAttachment', maxCount: 1 },
  ]),
  submitApplication
);

// Route to get application status by application ID (Admin only)
router.get('/status/:id', getApplicationStatus);

// Route to approve an application (Admin only)
router.patch('/approve/:id', approveApplication);

// Route to reject an application (Admin only)
router.post('/reject/:id', rejectApplication);

// Route to fetch an application by ID (Admin only)
router.get('/:id', getApplicationById);

// Route to fetch all applications (Admin only)
router.get('/all', getAllApplications);

// Route to update an application by ID (Admin only)
router.patch('/update/:id', updateApplication);

// Route to delete an application (Admin only)
router.delete('/delete/:id', deleteApplication);

module.exports = router;
