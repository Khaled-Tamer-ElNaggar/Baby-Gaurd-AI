import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import { useUser } from '../../contexts/UserContext';
import { Mail, Calendar, Baby, User, Plus } from 'lucide-react';
import AddChildModal from './components/AddChildModal';
import EditChildModal from './components/EditChildModal';
import ChildCard from './components/ChildCard';

interface Child {
  id: string;
  full_name: string;
  birth_date: string;
  birth_weight?: number;
  birth_height?: number;
  gender: 'male' | 'female' | 'other';
  blood_type?: string;
  genetic_conditions?: string;
}

const Profile = () => {
  const { user, userChildren, deleteChild } = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUsername(userData?.name || user?.name || 'Unknown');
        setEmail(userData?.email || user?.email || 'Not Provided');
        setJoinDate(userData?.join_date || 'Unknown');
      } catch (error) {
        console.error('Failed to parse userData from localStorage', error);
      }
    }
  }, [user]);

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };

  const handleDeleteChild = (id: string) => {
    deleteChild(id);
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Profile" />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              {/* Avatar */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold text-violet-600 dark:text-violet-400">
                    {username?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <InfoRow icon={<User />} label="Name" value={username} />
                <InfoRow icon={<Mail />} label="Email" value={email} />
                <InfoRow icon={<Calendar />} label="Member Since" value={joinDate} />
                <InfoRow icon={<Baby />} label="Status" value="Parent" />
              </div>
            </div>
          </div>

          {/* Right Column - Children Section */}
          <div className="lg:col-span-8">
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

              {userChildren.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userChildren.map(child => (
                    <ChildCard
                      key={child.id}
                      child={child}
                      onEdit={handleEditChild}
                      onDelete={() => handleDeleteChild(child.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditChildModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        child={selectedChild}
      />

      <Navbar />
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) => (
  <div className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-gray-700 rounded-lg">
    <div className="w-5 h-5 text-violet-600 dark:text-violet-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
  </div>
);

export default Profile;