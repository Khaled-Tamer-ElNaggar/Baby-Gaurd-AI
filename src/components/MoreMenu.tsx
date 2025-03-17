import React from 'react';
import { Image, Activity, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    { icon: <Image />, label: 'Gallery', path: '/gallery' },
    { icon: <Activity />, label: 'Wellness', path: '/wellness' },
    { icon: <Settings />, label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 z-50">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className="w-full flex items-center gap-3 p-3 hover:bg-violet-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <span className="text-violet-600 dark:text-violet-400">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default MoreMenu;