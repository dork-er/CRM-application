const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid token. User does not exist.' });
    }

    req.user = { id: user.id, role: user.role }; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

module.exports = authMiddleware;
