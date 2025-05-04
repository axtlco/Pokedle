import React from 'react';
import { useGame } from '../contexts/GameContext';
import { CellStatus } from '../contexts/GameContext';

const GameBoard: React.FC = () => {
  const { targetJamoLength, guesses, currentGuess, gameStatus } = useGame();
  const maxAttempts = 6;

  const rows = [];

  // Add rows for previous guesses
  for (let i = 0; i < guesses.length; i++) {
    rows.push(
      <div key={`guess-${i}`} className="flex justify-center space-x-1">
        {guesses[i].jamo.map((char, j) => (
          <Cell 
            key={`${i}-${j}`} 
            value={char} 
            status={guesses[i].statuses[j]} 
            idx={j}
            isRevealed={true}
          />
        ))}
      </div>
    );
  }

  // Add row for current guess
  if (gameStatus === 'playing') {
    rows.push(
      <div key="current-guess" className="flex justify-center space-x-1">
        {Array.from({ length: targetJamoLength }).map((_, i) => (
          <Cell 
            key={`current-${i}`} 
            value={currentGuess[i] || ''} 
            status={currentGuess[i] ? 'filled' : 'empty'}
            idx={i}
            isRevealed={false}
          />
        ))}
      </div>
    );
  }

  // Add empty rows for remaining attempts
  const remainingRows = maxAttempts - guesses.length - (gameStatus === 'playing' ? 1 : 0);
  for (let i = 0; i < remainingRows; i++) {
    rows.push(
      <div key={`empty-${i}`} className="flex justify-center space-x-1">
        {Array.from({ length: targetJamoLength }).map((_, j) => (
          <Cell 
            key={`empty-${i}-${j}`} 
            value="" 
            status="empty"
            idx={j}
            isRevealed={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1 w-full max-w-sm">
      {rows}
    </div>
  );
};

interface CellProps {
  value: string;
  status: CellStatus;
  idx: number;
  isRevealed: boolean;
}

const Cell: React.FC<CellProps> = ({ value, status, idx, isRevealed }) => {
  /*
  const getBgColor = () => {
    if (!isRevealed) return 'bg-white dark:bg-gray-800';
    switch (status) {
      case 'correct': return 'bg-correct text-white';
      case 'present': return 'bg-present text-white';
      case 'absent': return 'bg-absent text-white';
      default: return 'bg-white dark:bg-gray-800';
    }
  };
  */ 
  const getBgColor = () => {
    if (!isRevealed) {
      if (status === 'filled') {
        return 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white';
      }
      return 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  
    switch (status) {
      case 'correct': return 'bg-correct text-white';
      case 'present': return 'bg-present text-white';
      case 'absent': return 'bg-absent text-white';
      default: return 'bg-white dark:bg-gray-800';
    }
  };  

  const getDelayStyle = () => {
    return { transitionDelay: `${idx * 150}ms` };
  };

  return (
    <div 
      className={`
        flex items-center justify-center w-8 h-8 
        border-2 font-bold text-lg rounded
        ${value ? 'border-gray-400 dark:border-gray-500' : 'border-gray-300 dark:border-gray-600'}
        ${getBgColor()}
        ${isRevealed ? 'flip' : value ? 'bounce' : ''}
        transition-colors duration-500
      `}
      style={getDelayStyle()}
    >
      {value}
    </div>
  );
};

export default GameBoard;