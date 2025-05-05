// HMAC integrity checking 
const crypto = require('crypto');
const keys = require('../config/keys.config');

// Generate HMAC signature for data integrity
exports.generateSignature = (data) => {
  const hmac = crypto.createHmac('sha256', keys.encryptionKey);
  hmac.update(typeof data === 'string' ? data : JSON.stringify(data));
  return hmac.digest('hex');
};

// Verify data integrity using HMAC
exports.verifyIntegrity = (data, signature) => {
  const calculatedSignature = this.generateSignature(data);
  return calculatedSignature === signature;
};