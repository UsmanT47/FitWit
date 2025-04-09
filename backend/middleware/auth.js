const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (should be stored in environment variables in a real app)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

/**
 * Middleware to verify JWT token and protect routes
 */
const protect = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };