const express = require('express');
const {
  login,
  logout,
  getMe,
  refreshAccessToken,
} = require('../controllers/authController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Log in user
router.post('/login', login);

// Log out user
router.post('/logout', logout);

// Get logged-in user's details (Protected route)
router.get('/me', authMiddleware, getMe);

// Refresh token
router.post('/refresh', refreshAccessToken);

module.exports = router;
