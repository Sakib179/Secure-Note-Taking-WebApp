// Encryption/decryption service 
const crypto = require('crypto');
const keys = require('../config/keys.config');

// Convert key and IV from hex string to Buffer
const key = Buffer.from(keys.encryptionKey, 'hex');
const iv = Buffer.from(keys.encryptionIV, 'hex');

// Encrypt data using AES-256-CBC
exports.encrypt = (text) => {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

// Decrypt data using AES-256-CBC
exports.decrypt = (encryptedText) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return a placeholder value instead of throwing an error
    return "[Encrypted content - decryption failed]";
  }
};

// Generate HMAC for data integrity
exports.generateHmac = (data) => {
  try {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
  } catch (error) {
    console.error('HMAC generation error:', error);
    throw new Error('HMAC generation failed');
  }
};

// Verify HMAC for data integrity
exports.verifyHmac = (data, signature) => {
  const calculatedSignature = this.generateHmac(data);
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
};