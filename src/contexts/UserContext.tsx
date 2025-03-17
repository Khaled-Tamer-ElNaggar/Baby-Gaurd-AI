import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserType, Child } from '../lib/supabase';

interface UserContextType {
  user: User | null;
  children: Child[];
  currentChild: Child | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addChild: (childData: Omit<Child, 'id' | 'parent_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateChild: (id: string, updates: Partial<Child>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  setCurrentChild: (child: Child | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  full_name: 'Test User',
  user_type: 'parent',
  expected_due_date: '2024-09-01',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock children data
const mockChildren: Child[] = [
  {
    id: '1',
    parent_id: '1',
    name: 'Emma',
    birth_date: '2023-05-15',
    gender: 'female',
    weight: 3.5,
    height: 50,
    blood_type: 'A+',
    allergies: 'None',
    notes: 'Healthy baby girl',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    parent_id: '1',
    name: 'Noah',
    birth_date: '2021-03-10',
    gender: 'male',
    weight: 4.2,
    height: 55,
    blood_type: 'O+',
    allergies: 'Mild lactose intolerance',
    notes: 'Active toddler',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize with mock data for development
  useEffect(() => {
    if (user && childrenList.length > 0 && !currentChild) {
      setCurrentChild(childrenList[0]);
    }
  }, [user, childrenList, currentChild]);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Math.random().toString(),
        email,
        full_name: userData.full_name || '',
        user_type: userData.user_type as UserType || 'parent',
        expected_due_date: userData.expected_due_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      navigate('/home');
    } catch (error) {
      console.error('Error during sign up:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For development, accept any valid email/password
      if (email && password.length >= 6) {
        setUser(mockUser);
        setChildrenList(mockChildren);
        setCurrentChild(mockChildren[0]);
        navigate('/home');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setChildrenList([]);
      setCurrentChild(null);
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addChild = async (childData: Omit<Child, 'id' | 'parent_id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!user) throw new Error('User not authenticated');

      const newChild: Child = {
        ...childData,
        id: Math.random().toString(),
        parent_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setChildrenList(prev => [...prev, newChild]);
      
      // If this is the first child, set it as current
      if (childrenList.length === 0) {
        setCurrentChild(newChild);
      }

      return newChild;
    } catch (error) {
      console.error('Error adding child:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateChild = async (id: string, updates: Partial<Child>) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setChildrenList(prev => 
        prev.map(child => child.id === id ? { ...child, ...updates, updated_at: new Date().toISOString() } : child)
      );

      // Update current child if it's the one being updated
      if (currentChild && currentChild.id === id) {
        setCurrentChild(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Error updating child:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteChild = async (id: string) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedChildren = childrenList.filter(child => child.id !== id);
      setChildrenList(updatedChildren);

      // If the deleted child was the current one, set another child as current or null
      if (currentChild && currentChild.id === id) {
        setCurrentChild(updatedChildren.length > 0 ? updatedChildren[0] : null);
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        children: childrenList,
        currentChild,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addChild,
        updateChild,
        deleteChild,
        setCurrentChild,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};