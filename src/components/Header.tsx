import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BarChart2, ChevronDown, Home, Infinity } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';

const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        {/* 왼쪽: 도움말 버튼 */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-red dark:hover:text-pokemon-red"
          aria-label="Instructions"
        >
          <HelpCircle size={24} />
        </button>

        {/* 가운데: 제목 */}
        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-gray-100 flex items-center">
          <img src="/pokeball.svg" alt="Pokeball" className="w-8 h-8 mr-2" />
          포켓들 Pokedle
        </h1>

        {/* 오른쪽: 드롭다운 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-pokemon-blue dark:hover:text-pokemon-blue"
          >
            <ChevronDown size={20} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
              <button
                  onClick={() => {
                    setShowStats(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
                >
                  <BarChart2 size={18} />
                  <span>통계 보기</span>
              </button>
              {location.pathname === '/practice' ? (
                <button
                onClick={() => {
                  navigate('/');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
              >
                <Home size={18} />
                <span>홈으로</span>
              </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/practice');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
                >
                  <Infinity size={18} />
                  <span>연습 모드</span>
                </button>

              )}
            </div>
          )}
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </header>
  );
};

export default Header;


// 원본 
/** 
import React, { useState } from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';

const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <header className="py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-red dark:hover:text-pokemon-red"
          aria-label="Instructions"
        >
          <HelpCircle size={24} />
        </button>
        
        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-gray-100 flex items-center">
          <img src="/pokeball.svg" alt="Pokeball" className="w-8 h-8 mr-2" />
          포켓들 Pokedle
        </h1>
        
        <button
          onClick={() => setShowStats(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-blue dark:hover:text-pokemon-blue"
          aria-label="Statistics"
        >
          <BarChart2 size={24} />
        </button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </header>
  );
};

export default Header;
*/ 



// 무식한 버튼 있는 버전
/** 
import React, { useState } from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';

const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const location = useLocation(); // 현재 경로 확인

  return (
    <header className="py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-red dark:hover:text-pokemon-red"
          aria-label="Instructions"
        >
          <HelpCircle size={24} />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-gray-100 flex items-center">
          <img src="/pokeball.svg" alt="Pokeball" className="w-8 h-8 mr-2" />
          포켓들 Pokedle
        </h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-blue dark:hover:text-pokemon-blue"
            aria-label="Statistics"
          >
            <BarChart2 size={24} />
          </button>

          {location.pathname !== '/practice' && (
            <Link
              to="/practice"
              className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              연습 모드
            </Link>
          )}
          {location.pathname === '/practice' && (
            <Link
              to="/"
              className="px-3 py-1 text-sm rounded-md bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 transition"
            >
              홈으로
            </Link>
          )}
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </header>
  );
};

export default Header;
*/ 