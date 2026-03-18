import React from 'react';
import { LeaderboardEntry } from './types';

const LeaderboardRow = ({
  rank,
  entry,
  mode,
}: {
  rank: number;
  entry: LeaderboardEntry;
  mode: 'streak' | 'winrate' | 'practiceStreak';
}) => {
  const getValue = () => {
    switch (mode) {
      case 'streak':
        return `${entry.maxStreak}연승`;
      case 'practiceStreak':
        return `${entry.practiceMaxStreak}연승`;
      case 'winrate':
        return `승률 ${entry.winRate.toFixed(1)}%`;
    }
  };

  return (
    <div className="flex justify-between px-4 py-2 border rounded bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
      <div className="font-bold dark:text-white">{rank}. {entry.nickname}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{getValue()}</div>
    </div>
  );
};

export default LeaderboardRow;
