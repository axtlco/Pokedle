import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronDown, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';
import { useGame } from '../contexts/GameContext';
import GenToggleButton  from './dropdowns/GenToggleButton'; 
import StatsButton from './dropdowns/StatsButton';
import HomeButton from './dropdowns/HomeButton';
import PracticeButton from './dropdowns/PracticeButton';
import LeaderboardButton from './dropdowns/LeaderboardButton';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import ProfileModal from './modals/ProfileModal';


const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedGens, setSelectedGens } = useGame(); //context에서 받아오기
  const [showGenSelect, setShowGenSelect] = useState(false); // 세대 토글 열기 -> base는 닫기 상태
  const { user } = useAuth(); // 로그인 상태
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태
  const [showProfile, setShowProfile] = useState(false); // 프로필 모달 상태

  useEffect(() => {
    setDropdownOpen(false);
  }, [user]);

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

  
const renderDropdownItems = () => {
  const commonItems = (
    <>
      {location.pathname === '/practice' ? (
        <>
          {/* 연습 모드에서는 홈 버튼 + 세대 선택 토글 */}
          <HomeButton onClick={() => {
            navigate('/');
            setDropdownOpen(false);
          }} />
          <GenToggleButton
            showGenSelect={showGenSelect}
            toggleShow={() => setShowGenSelect(prev => !prev)}
            selectedGens={selectedGens}
            toggleGen={(gen) =>
              setSelectedGens((prev) => {
                if (!prev.includes(gen)) {
                  return [...prev, gen].sort((left, right) => left - right);
                }

                if (prev.length === 1) {
                  alert('최소 하나의 세대는 선택해야 합니다.');
                  return prev;
                }

                return prev.filter((value) => value !== gen);
              })
            }
          />
        </>
      ) : location.pathname === '/leaderboard' ? (
        <>
          {/* 리더보드에서는 홈 + 연습 모드 둘 다 보여주기 */}
          <HomeButton onClick={() => {
            navigate('/');
            setDropdownOpen(false);
          }} />
          <PracticeButton onClick={() => {
            navigate('/practice');
            setDropdownOpen(false);
          }} />
        </>
      ) : (
        <>
          {/* 데일리 모드에서는 연습 모드 버튼만 */}
          <PracticeButton onClick={() => {
            navigate('/practice');
            setDropdownOpen(false);
          }} />
        </>
      )}
  
      {/* 공통: 리더보드, 통계 보기 */}
      <LeaderboardButton onClick={() => {
        navigate('/leaderboard');
        setDropdownOpen(false);
      }} />
  
      <StatsButton onClick={() => {
        setShowStats(true);
        setDropdownOpen(false);
      }} />
    </>
  );

  return (
    <>
      {user ? (
        <>
          <button
            onClick={() => {
              setShowProfile(true);
              setDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
          >
            <UserCircle size={18} />
            <span>프로필</span>
          </button>
          <button
            onClick={async () => {
              await signOut(auth);
              setDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setShowLoginModal(true);
            setDropdownOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
        >
          <LogIn size={18} />
          <span>로그인</span>
        </button>
      )}
      {commonItems}
    </>
  );
};

  return (
    <header className="py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">

        <div className="relative flex items-center group">
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-red dark:hover:text-pokemon-red"
            aria-label="Instructions"
          >
            <HelpCircle size={24} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="ml-1 animate-pulse text-[10px] cursor-default relative">
            <span className="peer">{user ? '🟢' : '🟡'}</span>

            {/* 툴팁 아래 방향 */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max px-3 py-1 rounded-md bg-gray-800 text-white text-xs opacity-0 peer-hover:opacity-100 peer-hover:translate-y-1 transition-all duration-200 ease-in-out shadow-lg z-50 pointer-events-none">
              {user ? '로그인됨' : '로그인 필요'}
            </div>
          </div>
        </div>

        <h1
          onClick={() => navigate('/')}
          className="text-xl md:text-2xl font-bold text-black dark:text-gray-100 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
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
              {renderDropdownItems()}
            </div>
          )}
        </div>


      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

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
