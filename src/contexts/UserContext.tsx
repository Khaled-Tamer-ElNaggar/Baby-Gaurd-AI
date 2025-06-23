import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, RegisterData, LoginData } from '../lib/api';
import { jwtDecode } from 'jwt-decode';

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

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  userChildren: Child[];
  loading: boolean;
  signUp: (data: RegisterData) => Promise<void>;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => void;
  fetchChildren: () => Promise<void>;
  addChild: (data: Omit<Child, 'id'>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userChildren, setUserChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    const userDataString = localStorage.getItem('userData');
    if (token && userDataString) {
      try {
        const decoded = jwtDecode(token);
        const userData = JSON.parse(userDataString);
        setUser({
          id: decoded.sub as string,
          name: decoded.name as string || userData?.user_name,
          email: decoded.email as string || userData?.user_email,
        });
        fetchChildren();
      } catch (error) {
        console.error('Invalid token or user data:', error);
        auth.logout();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchChildren = async () => {
    const token = auth.getToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/children', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }

      const data = await response.json();
      setUserChildren(data.children || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChild = async (data: Omit<Child, 'id'>) => {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Please log in to add a child');
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/children', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add child');
      }

      await fetchChildren();
    } catch (error) {
      console.error('Error adding child:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteChild = async (id: string) => {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Please log in to delete a child');
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/children/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete child');
      }

      await fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await auth.register(data);
      setUser({
        id: response.user_id,
        name: data.user_name,
        email: data.user_email,
      });
      localStorage.setItem('userData', JSON.stringify({
        user_id: response.user_id,
        user_name: data.user_name,
        user_email: data.user_email,
      }));
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await auth.login(data);
      setUser(response.user);
      localStorage.setItem('userData', JSON.stringify(response.user));
      await fetchChildren();
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    auth.logout();
    setUser(null);
    setUserChildren([]);
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userChildren,
        loading,
        signUp,
        signIn,
        signOut,
        fetchChildren,
        addChild,
        deleteChild,
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