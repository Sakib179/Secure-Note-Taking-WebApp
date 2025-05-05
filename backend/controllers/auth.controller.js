// Authentication controller 
const User = require('../models/user.model');
const passwordService = require('../services/password.service');
const jwtService = require('../services/jwt.service');
const response = require('../utils/response.util');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return response.error(res, 'Email already in use', 400);
    }
    
    // Create user
    const newUser = await User.create({ name, email, password });
    
    // Generate token
    const token = jwtService.generateToken(newUser);
    
    return response.success(res, { token }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Registration error:', error);
    return response.error(res, 'Registration failed');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return response.error(res, 'Invalid credentials', 401);
    }
    
    // Verify password
    const isPasswordValid = await passwordService.verifyPassword(
      password, 
      user.passwordSalt, 
      user.passwordHash
    );
    
    if (!isPasswordValid) {
      return response.error(res, 'Invalid Password', 401);
    }
    
    // Generate token
    const token = jwtService.generateToken(user);
    
    return response.success(res, { token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return response.error(res, 'Login failed');
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };
    
    return response.success(res, { user }, 'User profile retrieved');
  } catch (error) {
    console.error('Get profile error:', error);
    return response.error(res, 'Failed to get user profile');
  }
};