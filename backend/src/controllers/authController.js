// Importing modules.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importing Models.
const User = require('../models/User');

// Generator functions for access and refresh tokens.
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' } // Short-lived access token (15 minutes)
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token (7 days)
  );

  return { accessToken, refreshToken };
};

// User Login Controller.
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Identifier can be email or phone number

    // Check if identifier and password are provided
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: 'Both identifier and password are required.' });
    }

    // Find user by email or phone number
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '1d',
    // });

    const { accessToken, refreshToken } = generateToken(user);

    // Return token and user data (excluding password)
    res.status(200).json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh Access Token Controller
exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '15m',
          }
        );

        res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (Handled on the client-side)
exports.logout = async (req, res) => {
  try {
    // Simply return a success message (client should remove the token)
    res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get logged-in user's details
exports.getMe = async (req, res) => {
  try {
    // Fetch the user from the database, excluding the password field
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
