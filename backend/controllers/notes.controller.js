// Notes controller 
const Note = require('../models/note.model');
const response = require('../utils/response.util');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    
    const newNote = await Note.create(userId, { title, content });
    
    return response.success(res, { note: newNote }, 'Note created successfully', 201);
  } catch (error) {
    console.error('Create note error:', error);
    return response.error(res, 'Failed to create note');
  }
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.findByUserId(userId);
    
    return response.success(res, { notes }, 'Notes retrieved successfully');
  } catch (error) {
    console.error('Get notes error:', error);
    return response.error(res, 'Failed to retrieve notes');
  }
};

// Get note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const note = await Note.findById(id, userId);
    
    if (!note) {
      return response.notFound(res, 'Note not found');
    }
    
    // Integrity check warning if needed
    if (!note.integrityValid) {
      return response.error(res, 'Note content may have been tampered with', 409, { 
        note, 
        warning: 'Integrity check failed'
      });
    }
    
    return response.success(res, { note }, 'Note retrieved successfully');
  } catch (error) {
    console.error('Get note error:', error);
    return response.error(res, 'Failed to retrieve note');
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    
    const updatedNote = await Note.update(id, userId, { title, content });
    
    if (!updatedNote) {
      return response.notFound(res, 'Note not found');
    }
    
    return response.success(res, { note: updatedNote }, 'Note updated successfully');
  } catch (error) {
    console.error('Update note error:', error);
    return response.error(res, 'Failed to update note');
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const isDeleted = await Note.delete(id, userId);
    
    if (!isDeleted) {
      return response.notFound(res, 'Note not found');
    }
    
    return response.success(res, null, 'Note deleted successfully');
  } catch (error) {
    console.error('Delete note error:', error);
    return response.error(res, 'Failed to delete note');
  }
};