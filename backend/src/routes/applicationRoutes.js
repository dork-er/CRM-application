const express = require('express');
const {
  submitApplication,
  getApplicationStatus,
  approveApplication,
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

// Route to get application status by application ID
router.get('/status/:id', getApplicationStatus);

// Route to approve an application (Admin only)
router.post('/approve/:id', approveApplication);

module.exports = router;
