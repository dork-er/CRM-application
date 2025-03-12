const express = require('express');
const {
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUserRole,
} = require('../controllers/userController');

// Importing authentication middleware to protect routes
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// USER ROUTES
//
// Update user info (requires authentication)
router.patch('/update', authMiddleware, updateUser);

// ADMIN ROUTES
//
// Fetch all users (Admin only)
router.get('/all', authMiddleware, getAllUsers);

// Fetch a user by ID (Admin only)
router.get('/:id', authMiddleware, getUserById);

// Delete a user (Admin Only)
router.delete('/delete/:id', authMiddleware, deleteUser);

// Route to up update user's role (Admin only)
router.patch('/role/:id', authMiddleware, updateUserRole);

module.exports = router;
