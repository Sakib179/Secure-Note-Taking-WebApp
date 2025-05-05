// Header component 
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';

const Header = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">Secure Notes</Link>
          <nav>
            <ul className="flex space-x-6">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/notes" className="text-gray-700 hover:text-blue-600">My Notes</Link>
                  </li>
                  <li>
                    <Link to="/notes/create" className="text-gray-700 hover:text-blue-600">Create Note</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;