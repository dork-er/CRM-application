const express = require('express');
const { submitReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// USER ROUTES
//
// Submit a Report
router.post('/submit', authMiddleware, submitReport);

module.exports = router;
