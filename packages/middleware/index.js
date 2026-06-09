const jwt = require('jsonwebtoken');

// Standardized Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message: message,
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

// Simple JWT Auth Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // In production with RS256, we'd verify with the public key.
    // We are setting up a placeholder for the API gateway to use.
    const decoded = jwt.decode(token); 
    if (!decoded) throw new Error('Invalid token');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = {
  errorHandler,
  requireAuth
};
