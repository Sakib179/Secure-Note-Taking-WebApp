// Footer component 
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Secure Notes App - CSE447 Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;