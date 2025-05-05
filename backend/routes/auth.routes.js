// Authentication routes 
const express = require('express');
const authController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', validationMiddleware.validateRegistration, authController.register);
router.post('/login', validationMiddleware.validateLogin, authController.login);

// Protected routes
router.get('/profile', authMiddleware.protect, authController.getProfile);

module.exports = router;