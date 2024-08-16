const jwt = require('jsonwebtoken');

// Middleware to check authentication and authorization
const auth = (roles = []) => async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    if (!token) {
      console.log('why am i here?')
      return res.status(401).send({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email) console.log(decoded.email)
    else console.log('no email')
    if (decoded.role) console.log(decoded.role)
    else console.log('no role')
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).send({ error: 'Access denied' });
    }

    req.email = decoded.email
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
