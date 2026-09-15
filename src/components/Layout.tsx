import React from 'react';
import Header from './Header';
import { Sun, Moon, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { loading } = useAuth();
  if (loading) return null;
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
          <p>@axtlco Pokedle &copy; {new Date().getFullYear()}</p>
          <br></br>
          <p>Contact: axtlz47@gmail.com</p>
          <a
            href="https://github.com/axtlco/Pokedle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub에서 소스 코드 보기 (새 탭)"
            className="mt-3 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs hover:text-gray-800 dark:hover:text-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <Github size={14} aria-hidden="true" />
            <span>소스 코드</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
