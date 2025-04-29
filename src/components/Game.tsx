import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import ResultMessage from './ResultMessage';
import { useGame } from '../contexts/GameContext';

const Game: React.FC = () => {
  const { 
    targetJamoLength, 
    handleKeyInput, 
    submitGuess, 
    isGameOver 
  } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        handleKeyInput('Backspace');
      } else if (/^[ㄱ-ㅎㅏ-ㅣ]$/.test(e.key)) {
        handleKeyInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyInput, submitGuess]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center mb-2">
        <p className="text-gray-700 dark:text-gray-300">
          오늘의 포켓몬: <span className="font-bold">{targetJamoLength}자</span>
        </p>
      </div>
      
      <GameBoard />
      
      {isGameOver && <ResultMessage />}
      
      <Keyboard />
    </div>
  );
};

export default Game;