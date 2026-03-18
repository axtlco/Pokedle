import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Modal from './Modal';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  DEFAULT_STORED_GAME_STATS,
  StoredGameStats,
  loadStoredGameStats,
} from '../../utils/stats';

interface StatsModalProps {
  onClose: () => void;
}

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

const defaultStats: GameStats = {
  gamesPlayed: DEFAULT_STORED_GAME_STATS.gamesPlayed,
  gamesWon: DEFAULT_STORED_GAME_STATS.gamesWon,
  currentStreak: DEFAULT_STORED_GAME_STATS.currentStreak,
  maxStreak: DEFAULT_STORED_GAME_STATS.maxStreak,
  guessDistribution: [...DEFAULT_STORED_GAME_STATS.guessDistribution],
};

const toDisplayStats = (stats: StoredGameStats): GameStats => {
  return {
    gamesPlayed: stats.gamesPlayed,
    gamesWon: stats.gamesWon,
    currentStreak: stats.currentStreak,
    maxStreak: stats.maxStreak,
    guessDistribution: stats.guessDistribution,
  };
};

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const { gameStatus, mode } = useGame();
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const loadStats = async () => {
      if (gameStatus !== 'playing' && user) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats({
            gamesPlayed: data.totalCount || 0,
            gamesWon: data.winCount || 0,
            currentStreak: data.recentStreak || 0,
            maxStreak: data.maxStreak || 0,
            guessDistribution: data.guessDistribution || [0, 0, 0, 0, 0, 0],
          });
          return;
        }

        setStats(defaultStats);
        return;
      }

      setStats(toDisplayStats(loadStoredGameStats()));
    };

    loadStats();
  }, [gameStatus, user]);

  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;
  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal title="통계" onClose={onClose}>
      <div className="space-y-6 text-black dark:text-white">
        {mode === 'practice' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            통계는 일일 모드 기준으로 집계됩니다. 연습 모드 리더보드 규칙은 리더보드 페이지에서 확인할 수 있습니다.
          </p>
        )}

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{stats.gamesPlayed}</span>
            <span className="text-sm">게임</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{winPercentage}</span>
            <span className="text-sm">승률 %</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{stats.currentStreak}</span>
            <span className="text-sm">현재 연승</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{stats.maxStreak}</span>
            <span className="text-sm">최대 연승</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">시도별 성공</h3>
          <div className="space-y-2">
            {stats.guessDistribution.map((count, index) => {
              const percentage = Math.max((count / maxGuesses) * 100, 8);

              return (
                <div key={index} className="flex items-center">
                  <div className="w-3 mr-2">{index + 1}</div>
                  <div
                    className="h-5 bg-blue-500 text-white px-2 flex items-center justify-end transition-all duration-1000 ease-out min-w-[2rem] rounded"
                    style={{ width: `${percentage}%` }}
                  >
                    <span>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StatsModal;
