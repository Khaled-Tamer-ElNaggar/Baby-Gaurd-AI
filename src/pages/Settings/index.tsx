import React, { useState } from 'react';
import { Moon, Sun, Type, Bell, Shield, HelpCircle, Trash2 } from 'lucide-react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, fontSize, toggleTheme, setFontSize } = useTheme();
  const { signOut } = useUser();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Settings" />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
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
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            {/* Account Deletion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Delete Account</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

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