import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isOrangeMode: boolean;
  toggleOrangeMode: () => void;
  setOrangeMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isOrangeMode, setIsOrangeModeState] = useState<boolean>(() => {
    const savedOrange = localStorage.getItem('orangeMode');
    if (savedOrange !== null) return savedOrange === 'true';
    return true; // Default to true on orange-mode branch
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (isOrangeMode) {
      root.classList.add('orange-theme');
    } else {
      root.classList.remove('orange-theme');
    }
    localStorage.setItem('orangeMode', String(isOrangeMode));
  }, [isOrangeMode]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleOrangeMode = () => {
    setIsOrangeModeState((prev) => !prev);
  };

  const setOrangeMode = (enabled: boolean) => {
    setIsOrangeModeState(enabled);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isOrangeMode,
        toggleOrangeMode,
        setOrangeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
