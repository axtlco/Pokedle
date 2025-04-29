import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Share2 } from 'lucide-react';

const ResultMessage: React.FC = () => {
  const { gameStatus, targetPokemon, guesses } = useGame();
  
  const isWinner = gameStatus === 'won';
  
  const handleShare = () => {
    const emojiGrid = guesses.map(guess => {
      return guess.statuses.map(status => {
        switch (status) {
          case 'correct': return '🟩';
          case 'present': return '🟨';
          case 'absent': return '⬛';
          default: return '⬜';
        }
      }).join('');
    }).join('\n');
    
    const shareText = `포켓몬 워들 ${isWinner ? guesses.length : 'X'}/${6}\n\n${emojiGrid}`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert('결과가 클립보드에 복사되었습니다!');
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 복사에 실패했습니다.');
      });
  };
  
  return (
    <div className="w-full max-w-sm p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-md text-center">
      <h2 className={`text-2xl font-bold mb-2 ${isWinner ? 'text-correct' : 'text-pokemon-red'}`}>
        {isWinner ? '축하합니다!' : '아쉽네요!'}
      </h2>
      
      <p className="mb-4">
        {isWinner 
          ? `${guesses.length}번의 시도로 맞추셨습니다!` 
          : `정답은 "${targetPokemon}" 입니다.`
        }
      </p>
      
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="flex items-center px-4 py-2 bg-pokemon-blue text-white rounded-md font-medium hover:bg-opacity-90 transition-colors"
        >
          <Share2 size={18} className="mr-2" />
          결과 공유하기
        </button>
      </div>
    </div>
  );
};

export default ResultMessage;