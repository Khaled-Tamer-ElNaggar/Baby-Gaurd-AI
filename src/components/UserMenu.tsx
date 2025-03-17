import React, { useState } from 'react';
import { User } from 'lucide-react';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 hover:bg-violet-100 rounded-full"
      >
        <User className="w-6 h-6 text-violet-900" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-50"
              onClick={() => setIsOpen(false)}
            >
              Login
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-50"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;