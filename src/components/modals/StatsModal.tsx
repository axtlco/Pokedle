import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useGame } from '../../contexts/GameContext';

interface StatsModalProps {
  onClose: () => void;
}

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastCompletedDate: string | null;
}

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const { gameStatus, guesses, gameDate } = useGame();
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastCompletedDate: null
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Update stats if game is completed and not already counted
    if (gameStatus !== 'playing' && gameDate !== stats.lastCompletedDate) {
      const newStats = { ...stats };
      
      // Increment games played
      newStats.gamesPlayed += 1;
      
      // Check if won
      if (gameStatus === 'won') {
        newStats.gamesWon += 1;
        
        // Update guess distribution
        const guessCount = guesses.length;
        newStats.guessDistribution[guessCount - 1] += 1;
        
        // Update streak
        newStats.currentStreak += 1;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
      } else {
        // Reset streak on loss
        newStats.currentStreak = 0;
      }
      
      // Mark this game as counted
      newStats.lastCompletedDate = gameDate;
      
      // Save updated stats
      localStorage.setItem('gameStats', JSON.stringify(newStats));
      setStats(newStats);
    }
  }, [gameStatus, guesses.length, gameDate, stats]);

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal title="통계" onClose={onClose}>
      <div className="space-y-6">
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
              const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-3 mr-2">{index + 1}</div>
                  <div 
                    className="h-5 bg-pokemon-blue text-white px-2 flex items-center justify-end transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    {count > 0 && <span>{count}</span>}
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