const jwt = require('jsonwebtoken');

// Middleware to check authentication and authorization
const auth = (roles = []) => async (req, res, next) => {
  try {
    // Extract the token correctly
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '').trim();
    console.log(token);

    // Check if the token exists, else return 401
    if (!token) {
      return res.status(401).send({ error: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log decoded email and role
    if (decoded.email) console.log(decoded.email);
    else console.log('no email');
    if (decoded.role) console.log(decoded.role);
    else console.log('no role');

    // Check if user has the required role
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).send({ error: 'Access denied' });
    }

    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
