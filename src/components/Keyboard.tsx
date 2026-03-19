import React from 'react';
import { useGame } from '../contexts/GameContext';

const koreanKeyboard = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '←', 'Enter'],
];

const Keyboard: React.FC = () => {
  const { handleKeyInput, submitGuess, letterStatuses, isGameOver } = useGame();

  const getKeyColor = (key: string) => {
    if (isGameOver) {
      return 'opacity-50';
    }

    if (key === '←' || key === 'Enter') {
      return 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200';
    }

    const status = letterStatuses[key];

    switch (status) {
      case 'correct':
        return 'bg-correct text-white';
      case 'present':
        return 'bg-present text-white';
      case 'absent':
        return 'bg-absent dark:bg-absent-dark text-white';
      default:
        return 'bg-key-bg dark:bg-key-bg-dark text-gray-800 dark:text-gray-200';
    }
  };

  const handleKeyClick = (key: string) => {
    if (isGameOver) {
      return;
    }

    if (key === 'Enter') {
      submitGuess();
      return;
    }

    handleKeyInput(key);
  };

  return (
    <div className="w-full max-w-md px-1 py-2">
      {koreanKeyboard.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex justify-center mb-2 text-gray-900 dark:text-white"
        >
          {row.map((key) => {
            const isWide = key === '←' || key === 'Enter';

            return (
              <button
                key={key}
                className={`
                  ${isWide ? 'w-16' : 'w-9'} h-12
                  m-0.5 rounded-md font-medium
                  flex items-center justify-center
                  ${getKeyColor(key)}
                  hover:filter hover:brightness-95 transition-all
                  active:transform active:scale-95
                `}
                onClick={() => handleKeyClick(key)}
                disabled={isGameOver}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
