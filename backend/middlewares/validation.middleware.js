// Request validation middleware 
const response = require('../utils/response.util');

exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};
  
  // Validate name
  if (!name || name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email';
    }
  }
  
  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    return response.error(res, 'Validation failed', 400, errors);
  }
  
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};
  
  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  }
  
  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return response.error(res, 'Validation failed', 400, errors);
  }
  
  next();
};

exports.validateNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = {};
  
  // Validate title
  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  // Validate content
  if (!content || content.trim() === '') {
    errors.content = 'Content is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return response.error(res, 'Validation failed', 400, errors);
  }
  
  next();
};