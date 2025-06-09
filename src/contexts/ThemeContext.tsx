import React, { createContext, useContext, useState, useEffect } from 'react';

const darkMode = localStorage.getItem('darkMode');
const fontSize = localStorage.getItem('fontSize');

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'normal' | 'large';

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'normal':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
    }
  }, [theme, fontSize]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};