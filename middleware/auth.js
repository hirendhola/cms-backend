const jwt = require('jsonwebtoken');

// Middleware to check authentication and authorization
const auth = (roles = []) => async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).send({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check if user role is allowed
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).send({ error: 'Access denied' });
    }

    req.user = decoded; // Attach user info to request
    req.email = decoded.email
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
