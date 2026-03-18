import React from 'react';
import { Share2, RotateCcw } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { encodeIndex } from '../utils/encodings';
import { POKEMON_LIST } from '../utils/pokemon';

const ResultMessage: React.FC = () => {
  const {
    gameStatus,
    targetPokemon,
    guesses,
    mode,
    resetGame,
    isPracticeLeaderboardEligible,
  } = useGame();

  const isWinner = gameStatus === 'won';

  const handleShare = () => {
    const emojiGrid = guesses
      .map((guess) =>
        guess.statuses
          .map((status) => {
            switch (status) {
              case 'correct':
                return '🟩';
              case 'present':
                return '🟨';
              case 'absent':
              default:
                return '⬜';
            }
          })
          .join('')
      )
      .join('\n');

    const baseUrl = window.location.origin;
    const targetIndex = POKEMON_LIST.indexOf(targetPokemon);
    const shareUrl =
      mode === 'practice' && targetIndex >= 0
        ? `${baseUrl}/practice?target=${encodeIndex(targetIndex)}`
        : baseUrl;

    const shareText = `포켓몬 Pokedle ${isWinner ? guesses.length : 'X'}/6\n\n${emojiGrid}\n\n${shareUrl}`;

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('결과가 클립보드에 복사되었습니다.');
      })
      .catch((error) => {
        console.error('클립보드 복사 실패:', error);
        alert('클립보드 복사에 실패했습니다.');
      });
  };

  return (
    <div className="w-full max-w-sm p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-md text-center">
      <h2 className={`text-2xl font-bold mb-2 ${isWinner ? 'text-correct' : 'text-red-500'}`}>
        {isWinner ? '축하합니다!' : '아쉬워요!'}
      </h2>

      <p className="mb-4 text-gray-800 dark:text-gray-100">
        {isWinner
          ? `${guesses.length}번의 시도로 맞혔습니다!`
          : `정답은 "${targetPokemon}" 입니다.`}
      </p>

      {mode === 'practice' && !isPracticeLeaderboardEligible && (
        <p className="mb-4 text-sm text-amber-600 dark:text-amber-300">
          현재 설정은 연습 리더보드 집계 대상이 아닙니다. 1~9세대를 모두 선택하면 연승이 반영됩니다.
        </p>
      )}

      <div className="flex justify-center gap-x-3">
        <button
          onClick={handleShare}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          <Share2 size={18} className="mr-2" />
          결과 공유하기
        </button>

        {mode === 'practice' && (
          <button
            onClick={resetGame}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={18} className="mr-2" />
            다시 하기
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultMessage;
