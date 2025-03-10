const User = require('../models/User');
const Application = require('../models/Application');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration (After application approval)
exports.registerUser = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    // Find application
    const application = await Application.findOne({ idNumber });
    if (!application) {
      return res
        .status(404)
        .json({ message: 'Application not found or not approved' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user using application details
    const newUser = new User({
      fullName: application.fullName,
      idNumber: application.idNumber,
      idAttachment: application.idAttachment,
      contactAddress: application.contactAddress,
      pinNumber: application.pinNumber,
      pinAttachment: application.pinAttachment,
      phoneNumber: application.phoneNumber,
      email: application.email,
      block: application.block,
      roadStreet: application.roadStreet,
      plotNumber: application.plotNumber,
      ownerName: application.ownerName,
      sizeRequired: application.sizeRequired,
      dateRequired: application.dateRequired,
      consumerCategory: application.consumerCategory,
      sanitationMethod: application.sanitationMethod,
      password, // Hashed automatically by the model
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    // Find user
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
