import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, RegisterData, LoginData } from '../lib/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: RegisterData) => Promise<void>;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.sub as string,
          name: decoded.name as string,
          email: decoded.email as string,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        auth.logout();
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await auth.register(data);
      setUser({
        id: response.user_id,
        name: data.user_name,
        email: data.user_email,
      });
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
    navigate('/');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
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