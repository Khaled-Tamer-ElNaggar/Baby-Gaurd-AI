import React, { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import { useUser } from '../../contexts/UserContext';
import { Mail, Calendar, Baby, User, Plus } from 'lucide-react';
import AddChildModal from './components/AddChildModal';
import EditChildModal from './components/EditChildModal';
import ChildCard from './components/ChildCard';
import { Child } from '../../lib/supabase';

const Profile = () => {
  const { user, children, deleteChild } = useUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };

  const handleDeleteChild = (id: string) => {
    deleteChild(id);
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      {/* Page Header */}
      <Header title="Profile" />

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          {/* User Avatar */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-violet-600 dark:text-violet-400">
                {user?.full_name ? user.full_name.charAt(0) : '?'}
              </span>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-gray-700 rounded-lg">
              <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.full_name || 'Unknown'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-gray-700 rounded-lg">
              <Mail className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.email || 'Not Provided'}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-gray-700 rounded-lg">
              <Baby className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.user_type === 'pregnant' ? 'Expecting Mother' : 'Parent'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
              Children
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {children.length === 0 ? (
            <div className="text-center py-8">
              <Baby className="w-12 h-12 text-violet-300 dark:text-violet-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No children added yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                Add Your First Child
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map(child => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onEdit={handleEditChild}
                  onDelete={handleDeleteChild}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Child Modal */}
      <EditChildModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        child={selectedChild}
      />

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
};

export default Profile;