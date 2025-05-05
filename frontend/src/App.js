// Main App component 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotesList from './components/Notes/NotesList';
import CreateNote from './components/Notes/CreateNote';
import Profile from './components/User/Profile';

// Auth service
import { isAuthenticated, getToken } from './services/auth.service';

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Auth route protection
  const ProtectedRoute = ({ children }) => {
    if (!authChecked) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    return isAuth ? children : <Navigate to="/login" />;
  };

  // Public route (redirect if already logged in)
  const PublicRoute = ({ children }) => {
    if (!authChecked) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    return !isAuth ? children : <Navigate to="/notes" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isAuthenticated={isAuth} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to={isAuth ? "/notes" : "/login"} />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login setIsAuth={setIsAuth} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register setIsAuth={setIsAuth} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/notes" 
              element={
                <ProtectedRoute>
                  <NotesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notes/create" 
              element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;