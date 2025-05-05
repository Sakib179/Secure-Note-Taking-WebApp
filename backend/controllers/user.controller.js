// User profile controller 
const User = require('../models/user.model');
const response = require('../utils/response.util');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    
    // Check if email is being changed
    if (email && email !== req.user.email) {
      // Check if the new email is already in use
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return response.error(res, 'Email already in use', 400);
      }
    }
    
    // Only update fields that have changed
    const updateData = {};
    if (name && name !== req.user.name) updateData.name = name;
    if (email && email !== req.user.email) updateData.email = email;
    
    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await User.update(userId, updateData);
    }
    
    // Get updated user
    const updatedUser = await User.findById(userId);
    
    return response.success(
      res, 
      { user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } }, 
      'Profile updated successfully'
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return response.error(res, 'Failed to update profile');
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    if (!password) {
      return response.error(res, 'Password is required', 400);
    }
    
    if (password.length < 8) {
      return response.error(res, 'Password must be at least 8 characters', 400);
    }
    
    // Update user with new password
    await User.update(userId, { password });
    
    return response.success(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return response.error(res, 'Failed to change password');
  }
};