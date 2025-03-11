const express = require('express');
const { updateUser } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Update user info (requires authentication)
router.patch('/update', authenticate, updateUser);

module.exports = router;
