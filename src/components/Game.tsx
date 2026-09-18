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
    isGameOver,
    mode,
    isPracticeLeaderboardEligible,
  } = useGame();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        return;
      }

      if (event.code === 'Enter') {
        submitGuess();
        return;
      }

      if (event.code === 'Backspace') {
        handleKeyInput('Backspace');
        return;
      }

      const upperKey = event.key.toUpperCase();
      const key = alpha_2_kr[upperKey] || event.key;

      if (key.length === 1 && /^[ㄱ-ㅎㅏ-ㅣ가-힣]$/.test(key)) {
        handleKeyInput(key);
      }
    };

    window.addEventListener('keyup', listener);

    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [handleKeyInput, submitGuess]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center mb-2">
        <p className="text-gray-700 dark:text-gray-300">
          {mode === 'daily' ? '오늘의 포켓몬 이름' : '이번 연습 문제 이름'}:{' '}
          <span className="font-bold">{targetJamoLength}자</span>
        </p>
        {mode === 'practice' && !isPracticeLeaderboardEligible && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">
            연습 리더보드 연승은 1~9세대를 모두 선택한 게임만 집계됩니다.
          </p>
        )}
      </div>

      <GameBoard />

      {isGameOver ? <ResultMessage /> : <Keyboard />}
    </div>
  );
};

export default Game;
