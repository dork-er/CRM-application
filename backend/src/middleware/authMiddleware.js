// This middleware checks if the request has a valid token in the Authorization header. If the token is valid, it decodes the token and attaches the user data to the request object. The user data can then be accessed in the controller functions. If the token is invalid or missing, the middleware returns a 401 Unauthorized response.

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
