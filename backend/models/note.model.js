// Note model schema 
const db = require('./db');
const cryptoService = require('../services/crypto.service');
const hmacUtil = require('../utils/hmac.util');

// Note model methods
const Note = {
  // Create a new note
  create: async (userId, noteData) => {
    const encryptedTitle = cryptoService.encrypt(noteData.title);
    const encryptedContent = cryptoService.encrypt(noteData.content);
    const hmacSignature = hmacUtil.generateSignature(noteData.content);
    
    const query = `
      INSERT INTO notes (user_id, encrypted_title, encrypted_content, hmac_signature)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at, updated_at
    `;
    
    const values = [userId, encryptedTitle, encryptedContent, hmacSignature];
    const result = await db.query(query, values);
    
    return {
      id: result.rows[0].id,
      userId,
      title: noteData.title,
      content: noteData.content,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
  },
  
  // Find notes by user ID
  findByUserId: async (userId) => {
    const query = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC';
    const result = await db.query(query, [userId]);
    
    return result.rows.map(note => {
      const decryptedTitle = cryptoService.decrypt(note.encrypted_title);
      const decryptedContent = cryptoService.decrypt(note.encrypted_content);
      const isIntegrityValid = hmacUtil.verifyIntegrity(decryptedContent, note.hmac_signature);
      
      return {
        id: note.id,
        userId: note.user_id,
        title: decryptedTitle,
        content: decryptedContent,
        integrityValid: isIntegrityValid,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      };
    });
  },
  
  // Find note by ID
  findByUserId: async (userId) => {
    const query = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC';
    const result = await db.query(query, [userId]);
    
    return result.rows.map(note => {
      try {
        const decryptedTitle = cryptoService.decrypt(note.encrypted_title);
        const decryptedContent = cryptoService.decrypt(note.encrypted_content);
        const isIntegrityValid = hmacUtil.verifyIntegrity(decryptedContent, note.hmac_signature);
        
        return {
          id: note.id,
          userId: note.user_id,
          title: decryptedTitle,
          content: decryptedContent,
          integrityValid: isIntegrityValid,
          createdAt: note.created_at,
          updatedAt: note.updated_at
        };
      } catch (error) {
        // Return a note with error indicators
        return {
          id: note.id,
          userId: note.user_id,
          title: "[Decryption error]",
          content: "This note cannot be decrypted with the current encryption keys.",
          integrityValid: false,
          createdAt: note.created_at,
          updatedAt: note.updated_at
        };
      }
    });
  },
  
  // Update note
  update: async (id, userId, noteData) => {
    const encryptedTitle = cryptoService.encrypt(noteData.title);
    const encryptedContent = cryptoService.encrypt(noteData.content);
    const hmacSignature = hmacUtil.generateSignature(noteData.content);
    
    const query = `
      UPDATE notes 
      SET encrypted_title = $1, encrypted_content = $2, hmac_signature = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING id, created_at, updated_at
    `;
    
    const values = [encryptedTitle, encryptedContent, hmacSignature, id, userId];
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      userId,
      title: noteData.title,
      content: noteData.content,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
  },
  
  // Delete note
  delete: async (id, userId) => {
    const query = 'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await db.query(query, [id, userId]);
    return result.rows.length > 0;
  }
};

module.exports = Note;