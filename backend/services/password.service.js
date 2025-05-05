// Password service 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate a random salt
exports.generateSalt = (length = 16) => {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length);
};

// Hash password with SHA-256 and salt
exports.hashPassword = async (password, salt) => {
  // First create a SHA-256 hash
  const hash = crypto.createHash('sha256')
    .update(password + salt)
    .digest('hex');
  
  // Then use bcrypt for additional security
  return await bcrypt.hash(hash, 10);
};

// Verify password
exports.verifyPassword = async (password, salt, storedHash) => {
  // First create a SHA-256 hash
  const hash = crypto.createHash('sha256')
    .update(password + salt)
    .digest('hex');
  
  // Then compare using bcrypt
  return await bcrypt.compare(hash, storedHash);
};