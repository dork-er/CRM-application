// This middleware checks whether a user is admin. If the user is not an admin, the middleware returns a 403 Forbidden status code with a message. Otherwise, the middleware calls the next middleware in the stack.
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminMiddleware;
