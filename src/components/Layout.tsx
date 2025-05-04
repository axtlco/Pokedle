import React from 'react';
import Header from './Header';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-transition">
      <div className="max-w-md mx-auto px-4 py-2">
        <Header />
        <main className="py-4">
          {children}
        </main>
        <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-center items-center mb-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          <p>Axolotl Pokedle &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;