const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register user after application approval
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (Protected route)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
