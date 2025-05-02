import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import ResultMessage from './ResultMessage';
import { useGame } from '../contexts/GameContext';
import { alpha_2_kr } from '../utils/alpha_2_kr';

const Game: React.FC = () => {
  const { 
    targetJamoLength, 
    handleKeyInput, 
    submitGuess, 
    isGameOver 
  } = useGame();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') submitGuess()
      else if (e.code === 'Backspace') handleKeyInput('Backspace')
      else {
        const upperKey = e.key.toUpperCase()
        const key = alpha_2_kr[upperKey] || e.key
  
        if (key.length === 1 && /^[ㄱ-ㅎㅏ-ㅣ]$/.test(key)) {
          handleKeyInput(key)
        }
      }
    }
  
    window.addEventListener('keyup', listener)
    return () => window.removeEventListener('keyup', listener)
  }, [handleKeyInput, submitGuess])

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