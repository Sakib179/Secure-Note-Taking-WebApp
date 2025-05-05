// JWT verification middleware 
const jwtService = require('../services/jwt.service');
const User = require('../models/user.model');
const response = require('../utils/response.util');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return response.unauthorized(res, 'You are not logged in. Please log in to get access');
    }
    
    // 2) Verify token
    const decoded = jwtService.verifyToken(token);
    
    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return response.unauthorized(res, 'The user belonging to this token no longer exists');
    }
    
    // 4) GRANT ACCESS
    req.user = user;
    next();
  } catch (error) {
    return response.unauthorized(res, 'Authentication failed');
  }
};