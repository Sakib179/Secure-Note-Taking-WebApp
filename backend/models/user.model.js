// User model schema 
const db = require('./db');
const cryptoService = require('../services/crypto.service');
const passwordService = require('../services/password.service');

// User model methods
const User = {
  // Create a new user
  create: async (userData) => {
    const salt = passwordService.generateSalt();
    const passwordHash = await passwordService.hashPassword(userData.password, salt);
    
    const encryptedEmail = cryptoService.encrypt(userData.email);
    const encryptedName = cryptoService.encrypt(userData.name);
    
    const query = `
      INSERT INTO users (encrypted_email, encrypted_name, password_hash, password_salt)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    
    const values = [encryptedEmail, encryptedName, passwordHash, salt];
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  // Find user by email
  findByEmail: async (email) => {
    const encryptedEmail = cryptoService.encrypt(email);
    const query = 'SELECT * FROM users WHERE encrypted_email = $1';
    const result = await db.query(query, [encryptedEmail]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Decrypt sensitive information
    const user = result.rows[0];
    return {
      id: user.id,
      email: cryptoService.decrypt(user.encrypted_email),
      name: cryptoService.decrypt(user.encrypted_name),
      passwordHash: user.password_hash,
      passwordSalt: user.password_salt,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },
  
  // Find user by ID
  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Decrypt sensitive information
    const user = result.rows[0];
    return {
      id: user.id,
      email: cryptoService.decrypt(user.encrypted_email),
      name: cryptoService.decrypt(user.encrypted_name),
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },
  
  // Update user
  update: async (id, userData) => {
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (userData.name) {
      updates.push(`encrypted_name = $${paramCount}`);
      values.push(cryptoService.encrypt(userData.name));
      paramCount++;
    }
    
    if (userData.email) {
      updates.push(`encrypted_email = $${paramCount}`);
      values.push(cryptoService.encrypt(userData.email));
      paramCount++;
    }
    
    if (userData.password) {
      const salt = passwordService.generateSalt();
      const passwordHash = await passwordService.hashPassword(userData.password, salt);
      updates.push(`password_hash = $${paramCount}`);
      values.push(passwordHash);
      paramCount++;
      updates.push(`password_salt = $${paramCount}`);
      values.push(salt);
      paramCount++;
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (updates.length === 0) {
      return null;
    }
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id
    `;
    
    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = User;