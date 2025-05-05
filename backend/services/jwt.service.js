// JWT handling service 
const jwt = require('jsonwebtoken');
const keys = require('../config/keys.config');

// Generate JWT token
exports.generateToken = (userData) => {
  return jwt.sign(
    { id: userData.id }, 
    keys.jwtSecret, 
    { expiresIn: keys.jwtExpiry || '24h' }
  );
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, keys.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};