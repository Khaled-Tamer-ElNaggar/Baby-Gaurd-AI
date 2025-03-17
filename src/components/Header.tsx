import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ChildSelector from './ChildSelector';

interface HeaderProps {
  title: string;
  showChildSelector?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showChildSelector = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-violet-900 dark:text-violet-200">{title}</h1>
        {showChildSelector && <ChildSelector showAddButton onAddClick={() => navigate('/profile')} />}
      </div>
      {user && (
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
          >
            <User className="w-6 h-6 text-violet-900 dark:text-violet-200" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                >
                  View Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    signOut();
                    setShowMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;