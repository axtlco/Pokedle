import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BarChart2, ChevronDown, Home, Infinity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';
import { useGame } from '../contexts/GameContext';

const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedGens, setSelectedGens } = useGame(); //context에서 받아오기
  const [showGenSelect, setShowGenSelect] = useState(false); // 세대 토글 열기 -> base는 닫기 상태

  useEffect(() => {
    if (location.pathname === '/practice') {
      localStorage.setItem('selectedGens', JSON.stringify(selectedGens));
    }
  }, [selectedGens, location.pathname]);

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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-pokemon-blue dark:hover:text-pokemon-blue"
          >
            <ChevronDown size={20} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
              {/* 통계 보기 */}
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

              {/* 연습 모드일 경우에만 홈/세대 선택 */}
              {location.pathname === '/practice' ? (
                <>
                  {/* 홈으로 */}
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

                  {/* 세대 선택 토글 버튼 */}
                  <button
                    onClick={() => setShowGenSelect(prev => !prev)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
                  >
                    <ChevronDown size={18} />
                    <span>세대 선택</span>
                  </button>

                  {/* 세대 토글 UI */}
                  {showGenSelect && (
                    <div className="space-y-1 px-3 pb-3 pt-2">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(gen => {
                      const isSelected = selectedGens.includes(gen);
                      return (
                        <label
                          key={gen}
                          className="flex items-center justify-between gap-4 cursor-pointer py-1"
                        >
                          <span className="text-sm text-gray-800 dark:text-white">{gen}세대</span>
                  
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedGens(prev =>
                                prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen]
                              );
                            }}
                            className="sr-only"
                          />
                  
                          <div
                            className={`w-10 h-6 flex items-center rounded-full px-1 transition duration-300 ease-in-out ${
                              isSelected ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ${
                                isSelected ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div> 
                  )}
                </>
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