// Note Item component 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNote, updateNote } from '../../services/notes.service';

const NoteItem = ({ note, onNoteDeleted }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedNote({
      ...editedNote,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateNote(note.id, editedNote);
      note.title = editedNote.title;
      note.content = editedNote.content;
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update note');
      console.error('Update note error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedNote({
      title: note.title,
      content: note.content
    });
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsLoading(true);
      
      try {
        await deleteNote(note.id);
        onNoteDeleted(note.id);
      } catch (error) {
        setError('Failed to delete note');
        console.error('Delete note error:', error);
        setIsLoading(false);
      }
    }
  };

  // Show warning if note integrity is invalid
  const integrityWarning = !note.integrityValid && (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-3">
      <p className="text-yellow-700 text-sm">
        Warning: This note may have been tampered with.
      </p>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 note-card">
      {integrityWarning}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </div>
      )}

      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            className="input-field mb-3"
            placeholder="Note title"
          />
          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            className="input-field h-32 mb-3"
            placeholder="Note content"
          ></textarea>
          <div className="flex space-x-2 mt-4">
            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
          <p className="text-gray-600 mb-4 break-words whitespace-pre-wrap">{note.content}</p>
          <div className="text-gray-500 text-sm mb-4">
            Last updated: {formatDate(note.updatedAt)}
          </div>
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="btn-primary flex-1">
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isLoading} 
              className="btn-danger flex-1"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteItem;