// User Profile component 
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/auth.service';
import api from '../../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setProfileData({
          name: userData.name,
          email: userData.email
        });
      } catch (error) {
        setErrorMessage('Failed to load user profile');
        console.error('Profile error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setErrorMessage('');
  };

  const validateProfileForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!profileData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!profileData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      tempErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!passwordData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (passwordData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (passwordData.password !== passwordData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    try {
      const response = await api.put('/user/profile', profileData);
      
      if (response.data.status === 'success') {
        setUser({
          ...user,
          name: profileData.name,
          email: profileData.email
        });
        setIsEditingProfile(false);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    try {
      const response = await api.put('/user/password', {
        password: passwordData.password
      });
      
      if (response.data.status === 'success') {
        setPasswordData({ password: '', confirmPassword: '' });
        setIsEditingPassword(false);
        setSuccessMessage('Password changed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to change password. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfileData({ name: user.name, email: user.email });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <button 
              onClick={() => setIsEditingProfile(true)} 
              className="btn-primary"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Security</h2>

        {isEditingPassword ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Change Password
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordData({ password: '', confirmPassword: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              For security reasons, we recommend changing your password regularly.
            </p>
            <button 
              onClick={() => setIsEditingPassword(true)} 
              className="btn-primary"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;