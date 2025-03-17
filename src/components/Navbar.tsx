import React, { useState } from 'react';
import { Home, Calendar, MessageSquare, Heart, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MoreMenu from './MoreMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/home' },
    { icon: <Calendar className="w-6 h-6" />, label: 'Calendar', path: '/calendar' },
    { icon: <MessageSquare className="w-6 h-6" />, label: 'Chat', path: '/chat' },
    { icon: <Heart className="w-6 h-6" />, label: 'Health', path: '/health' },
    { icon: <Menu className="w-6 h-6" />, label: 'More', onClick: () => setIsMoreMenuOpen(true) }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-2">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick || (() => navigate(item.path))}
              className={`flex flex-col items-center ${
                location.pathname === item.path 
                  ? 'text-violet-600 dark:text-violet-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      <MoreMenu 
        isOpen={isMoreMenuOpen} 
        onClose={() => setIsMoreMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;