// Security keys configuration 
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  encryptionIV: process.env.ENCRYPTION_IV
};