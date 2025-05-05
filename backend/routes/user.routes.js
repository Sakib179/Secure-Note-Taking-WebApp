// User profile routes 
const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All user routes are protected
router.use(authMiddleware.protect);

router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);

module.exports = router;