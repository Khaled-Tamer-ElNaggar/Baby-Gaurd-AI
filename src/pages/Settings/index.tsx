import React from 'react';
import { Moon, Sun, Type, Bell, Shield, HelpCircle } from 'lucide-react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { theme, fontSize, toggleTheme, setFontSize } = useTheme();

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Settings" />

      <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h2 className="p-4 text-lg font-medium text-violet-900 dark:text-violet-200 border-b border-gray-100 dark:border-gray-700">
            Accessibility
          </h2>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Theme Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                ) : (
                  <Sun className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adjust app appearance</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Font Size */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Type className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Font Size</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adjust text size</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['small', 'normal', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-2 rounded-lg ${
                      fontSize === size
                        ? 'bg-violet-600 text-white'
                        : 'bg-violet-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <SettingItem
              icon={<Bell />}
              title="Notifications"
              description="Manage your alerts"
            />
            <SettingItem
              icon={<Shield />}
              title="Privacy"
              description="Control your data"
            />
            <SettingItem
              icon={<HelpCircle />}
              title="Help & Support"
              description="Get assistance"
            />
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

const SettingItem = ({ icon, title, description }) => (
  <button className="w-full p-4 flex items-center gap-3 hover:bg-violet-50 dark:hover:bg-gray-700">
    <div className="text-violet-600 dark:text-violet-400">{icon}</div>
    <div className="text-left">
      <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </button>
);

export default Settings;