// Notes List component 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotes } from '../../services/notes.service';
import NoteItem from './NoteItem';

const NotesList = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(filter.toLowerCase()) || 
    note.content.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCreateNote = () => {
    navigate('/notes/create');
  };

  const handleNoteDeleted = (deletedNoteId) => {
    setNotes(notes.filter(note => note.id !== deletedNoteId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
        <button onClick={handleCreateNote} className="btn-primary">Create New Note</button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={filter}
          onChange={handleFilter}
          className="input-field"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">
            {notes.length === 0 
              ? "You don't have any notes yet. Create your first note!" 
              : "No notes match your search."}
          </p>
          {notes.length === 0 && (
            <button 
              onClick={handleCreateNote} 
              className="btn-primary mt-4"
            >
              Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onNoteDeleted={handleNoteDeleted} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;