// Importing Models.
const User = require('../models/User');

// Update user info
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from the token
    const updates = req.body;

    // Prevent updating sensitive fields
    const restrictedFields = ['idNumber', 'email', 'password'];
    restrictedFields.forEach((field) => delete updates[field]);

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
