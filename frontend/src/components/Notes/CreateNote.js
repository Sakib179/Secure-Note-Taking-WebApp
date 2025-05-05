// Create Note component 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notes.service';

const CreateNote = () => {
  const navigate = useNavigate();
  const [noteData, setNoteData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { title, content } = noteData;

  const handleChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setApiError('');
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!title.trim()) {
      tempErrors.title = 'Title is required';
      isValid = false;
    }

    if (!content.trim()) {
      tempErrors.content = 'Content is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    try {
      await createNote(noteData);
      navigate('/notes');
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Failed to create note');
      } else {
        setApiError('An error occurred. Please try again later.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Note</h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Note title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              value={content}
              onChange={handleChange}
              className={`input-field min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Write your secure note here..."
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Note'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;