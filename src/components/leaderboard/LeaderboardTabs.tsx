import React from 'react';

type LeaderboardMode = 'streak' | 'winrate' | 'practiceStreak';

const LeaderboardTabs = ({
  mode,
  setMode,
}: {
  mode: LeaderboardMode;
  setMode: (value: LeaderboardMode) => void;
}) => {
  return (
    <>
      <button
        className={`px-3 py-1 rounded ${
          mode === 'streak'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
        }`}
        onClick={() => setMode('streak')}
      >
        일일 연승
      </button>
      <button
        className={`px-3 py-1 rounded ${
          mode === 'practiceStreak'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
        }`}
        onClick={() => setMode('practiceStreak')}
      >
        연습 연승
      </button>
      <button
        className={`px-3 py-1 rounded ${
          mode === 'winrate'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
        }`}
        onClick={() => setMode('winrate')}
      >
        승률
      </button>
    </>
  );
};

export default LeaderboardTabs;
