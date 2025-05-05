// Notes service 
import api from '../utils/api';

// Get all notes for current user
export const getNotes = async () => {
  try {
    const response = await api.get('/notes');
    return response.data.data.notes;
  } catch (error) {
    console.error('Get notes error:', error);
    throw error;
  }
};

// Get single note by ID
export const getNoteById = async (noteId) => {
  try {
    const response = await api.get(`/notes/${noteId}`);
    return response.data.data.note;
  } catch (error) {
    console.error('Get note error:', error);
    throw error;
  }
};

// Create new note
export const createNote = async (noteData) => {
  try {
    const response = await api.post('/notes', noteData);
    return response.data.data.note;
  } catch (error) {
    console.error('Create note error:', error);
    throw error;
  }
};

// Update existing note
export const updateNote = async (noteId, noteData) => {
  try {
    const response = await api.put(`/notes/${noteId}`, noteData);
    return response.data.data.note;
  } catch (error) {
    console.error('Update note error:', error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (noteId) => {
  try {
    await api.delete(`/notes/${noteId}`);
    return true;
  } catch (error) {
    console.error('Delete note error:', error);
    throw error;
  }
};