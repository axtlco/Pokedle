import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  DISASSEMBLED_POKEMON_SET,
  POKEMON_LIST,
  getDisassembledSetForGens,
  getPokemonByIndex,
  getPokemonOfTheDay,
  getRandomPokemon,
} from '../utils/pokemon';
import { decomposeHangul } from '../utils/korean';
import { decodeIndex } from '../utils/encodings';
import { saveGameResult } from '../utils/saveGameResult';
import { useAuth } from './AuthContext';
import {
  ALL_GENERATIONS,
  areAllGenerationsSelected,
  areGenerationListsEqual,
  normalizeSelectedGens,
} from '../utils/generations';
import { getCurrentKoreanDateString } from '../utils/date';
import { saveStoredDailyGameStats } from '../utils/stats';

export type CellStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface GuessResult {
  jamo: string[];
  statuses: CellStatus[];
}

interface GameState {
  targetPokemon: string;
  targetJamo: string[];
  guesses: GuessResult[];
  currentGuess: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  gameDate: string;
  maxAttempts: number;
  letterStatuses: Record<string, CellStatus>;
  selectedGens: number[];
  practiceTargetIndex: number | null;
}

interface GameContextType {
  targetPokemon: string;
  targetJamoLength: number;
  currentGuess: string[];
  guesses: GuessResult[];
  gameStatus: 'playing' | 'won' | 'lost';
  gameDate: string;
  letterStatuses: Record<string, CellStatus>;
  handleKeyInput: (key: string) => void;
  submitGuess: () => void;
  resetGame: () => void;
  isGameOver: boolean;
  mode: 'daily' | 'practice';
  selectedGens: number[];
  setSelectedGens: React.Dispatch<React.SetStateAction<number[]>>;
  isPracticeLeaderboardEligible: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const MAX_ATTEMPTS = 6;

const getStoredSelectedGens = (): number[] => {
  try {
    return normalizeSelectedGens(JSON.parse(localStorage.getItem('selectedGens') || 'null'));
  } catch {
    return [...ALL_GENERATIONS];
  }
};

const getPracticeTargetIndexFromQuery = (): number | null => {
  const queryTarget = new URLSearchParams(window.location.search).get('target');

  if (!queryTarget) {
    return null;
  }

  const index = decodeIndex(queryTarget);

  if (!Number.isInteger(index) || index < 0 || index >= POKEMON_LIST.length) {
    return null;
  }

  return index;
};

const createInitialState = ({
  mode = 'daily',
  selectedGens = [...ALL_GENERATIONS],
  practiceTargetIndex = null,
}: {
  mode?: 'daily' | 'practice';
  selectedGens?: number[];
  practiceTargetIndex?: number | null;
}): GameState => {
  const normalizedSelectedGens = normalizeSelectedGens(selectedGens);
  const gameDate = getCurrentKoreanDateString();

  const targetPokemon =
    mode === 'practice'
      ? practiceTargetIndex !== null
        ? getPokemonByIndex(practiceTargetIndex)
        : getRandomPokemon(normalizedSelectedGens)
      : getPokemonOfTheDay();

  return {
    targetPokemon,
    targetJamo: targetPokemon.split('').flatMap((char) => decomposeHangul(char)),
    guesses: [],
    currentGuess: [],
    gameStatus: 'playing',
    gameDate,
    maxAttempts: MAX_ATTEMPTS,
    letterStatuses: {},
    selectedGens: normalizedSelectedGens,
    practiceTargetIndex: mode === 'practice' ? practiceTargetIndex : null,
  };
};

export const GameProvider: React.FC<{
  children: React.ReactNode;
  mode?: 'daily' | 'practice';
}> = ({ children, mode = 'daily' }) => {
  const STORAGE_KEY = mode === 'practice' ? 'practiceGameState' : 'gameState';
  const { user, nickname } = useAuth();

  const initialSelectedGens = getStoredSelectedGens();
  const rawPracticeTarget = mode === 'practice'
    ? new URLSearchParams(window.location.search).get('target')
    : null;
  const practiceTargetIndex = mode === 'practice' ? getPracticeTargetIndexFromQuery() : null;
  const hasInvalidPracticeTarget = mode === 'practice' && Boolean(rawPracticeTarget) && practiceTargetIndex === null;

  const [selectedGens, setSelectedGens] = useState<number[]>(initialSelectedGens);

  const [gameState, setGameState] = useState<GameState>(() => {
    if (!hasInvalidPracticeTarget) {
      const savedState = localStorage.getItem(STORAGE_KEY);

      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState) as Partial<GameState>;
          const today = getCurrentKoreanDateString();
          const parsedSelectedGens = normalizeSelectedGens(parsedState.selectedGens);
          const parsedPracticeTargetIndex =
            typeof parsedState.practiceTargetIndex === 'number'
              ? parsedState.practiceTargetIndex
              : null;

          const isValidDaily = mode === 'daily' && parsedState.gameDate === today;
          const isValidPractice =
            mode === 'practice' &&
            areGenerationListsEqual(parsedSelectedGens, initialSelectedGens) &&
            parsedPracticeTargetIndex === practiceTargetIndex;

          if (
            parsedState.targetPokemon &&
            Array.isArray(parsedState.targetJamo) &&
            (isValidDaily || isValidPractice)
          ) {
            return {
              targetPokemon: parsedState.targetPokemon,
              targetJamo: parsedState.targetJamo,
              guesses: Array.isArray(parsedState.guesses) ? parsedState.guesses : [],
              currentGuess: Array.isArray(parsedState.currentGuess) ? parsedState.currentGuess : [],
              gameStatus:
                parsedState.gameStatus === 'won' || parsedState.gameStatus === 'lost'
                  ? parsedState.gameStatus
                  : 'playing',
              gameDate: parsedState.gameDate || today,
              maxAttempts: parsedState.maxAttempts || MAX_ATTEMPTS,
              letterStatuses: parsedState.letterStatuses || {},
              selectedGens: parsedSelectedGens,
              practiceTargetIndex: parsedPracticeTargetIndex,
            };
          }
        } catch (error) {
          console.error('Error parsing game state:', error);
        }
      }
    }

    return createInitialState({
      mode,
      selectedGens: initialSelectedGens,
      practiceTargetIndex,
    });
  });

  const validDisassembledSetRef = useRef<Set<string>>(DISASSEMBLED_POKEMON_SET);

  const {
    targetPokemon,
    targetJamo,
    guesses,
    currentGuess,
    gameStatus,
    gameDate,
    letterStatuses,
  } = gameState;

  const targetJamoLength = targetJamo.length;
  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';
  const hasSharedPracticeTarget = mode === 'practice' && practiceTargetIndex !== null;
  const isPracticeLeaderboardEligible =
    mode === 'practice' && areAllGenerationsSelected(selectedGens);

  useEffect(() => {
    if (!hasInvalidPracticeTarget) {
      return;
    }

    alert('유효하지 않은 연습 문제 링크입니다. 새로운 연습 문제를 시작합니다.');
  }, [hasInvalidPracticeTarget]);

  useEffect(() => {
    if (mode === 'practice') {
      localStorage.setItem('selectedGens', JSON.stringify(selectedGens));
    }
  }, [mode, selectedGens]);

  useEffect(() => {
    if (mode === 'practice') {
      validDisassembledSetRef.current = hasSharedPracticeTarget
        ? DISASSEMBLED_POKEMON_SET
        : getDisassembledSetForGens(selectedGens);
      return;
    }

    validDisassembledSetRef.current = DISASSEMBLED_POKEMON_SET;
  }, [hasSharedPracticeTarget, mode, selectedGens]);

  useEffect(() => {
    if (mode !== 'practice') {
      return;
    }

    setGameState((previousState) => {
      if (areGenerationListsEqual(previousState.selectedGens, selectedGens)) {
        return previousState;
      }

      if (hasSharedPracticeTarget) {
        return {
          ...previousState,
          selectedGens,
        };
      }

      localStorage.removeItem('randomPokemon');

      return createInitialState({
        mode,
        selectedGens,
        practiceTargetIndex,
      });
    });
  }, [hasSharedPracticeTarget, mode, practiceTargetIndex, selectedGens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState, STORAGE_KEY]);

  useEffect(() => {
    if (user || mode !== 'daily') {
      return;
    }

    saveStoredDailyGameStats({
      gameStatus,
      guessesLength: guesses.length,
      gameDate,
    });
  }, [gameDate, gameStatus, guesses.length, mode, user]);

  const handleKeyInput = useCallback(
    (key: string) => {
      if (isGameOver) {
        return;
      }

      setGameState((previousState) => {
        if (key === 'Backspace' || key === '←') {
          return {
            ...previousState,
            currentGuess: previousState.currentGuess.slice(0, -1),
          };
        }

        if (/^[ㄱ-ㅎㅏ-ㅣ가-힣]$/.test(key) && previousState.currentGuess.length < targetJamoLength) {
          return {
            ...previousState,
            currentGuess: [...previousState.currentGuess, key],
          };
        }

        return previousState;
      });
    },
    [isGameOver, targetJamoLength]
  );

  const submitGuess = useCallback(() => {
    if (isGameOver || currentGuess.length !== targetJamoLength) {
      return;
    }

    const disassembledInput = currentGuess.join('');
    const isValidGuess = validDisassembledSetRef.current.has(disassembledInput);
    const isKnownPokemon = DISASSEMBLED_POKEMON_SET.has(disassembledInput);

    if (!isValidGuess) {
      if (mode === 'practice' && !hasSharedPracticeTarget && isKnownPokemon) {
        alert('선택한 세대에 포함되지 않은 포켓몬입니다.');
      } else {
        alert('등록되지 않은 포켓몬 이름입니다.');
      }
      return;
    }

    const evaluateGuess = (guess: string[], target: string[]): CellStatus[] => {
      const result: CellStatus[] = Array(guess.length).fill('absent');
      const remainingTarget = [...target];

      for (let index = 0; index < guess.length; index += 1) {
        if (guess[index] === remainingTarget[index]) {
          result[index] = 'correct';
          remainingTarget[index] = '';
        }
      }

      for (let index = 0; index < guess.length; index += 1) {
        if (result[index] === 'correct') {
          continue;
        }

        const targetIndex = remainingTarget.indexOf(guess[index]);
        if (targetIndex !== -1) {
          result[index] = 'present';
          remainingTarget[targetIndex] = '';
        }
      }

      return result;
    };

    const statuses = evaluateGuess(currentGuess, targetJamo);
    const newGuess: GuessResult = { jamo: currentGuess, statuses };
    const newGuesses = [...guesses, newGuess];
    const newLetterStatuses = { ...letterStatuses };

    for (let index = 0; index < currentGuess.length; index += 1) {
      const character = currentGuess[index];
      const status = statuses[index];

      if (
        !newLetterStatuses[character] ||
        (newLetterStatuses[character] === 'absent' &&
          (status === 'present' || status === 'correct')) ||
        (newLetterStatuses[character] === 'present' && status === 'correct')
      ) {
        newLetterStatuses[character] = status;
      }
    }

    let newGameStatus = gameStatus;

    if (currentGuess.join('') === targetJamo.join('')) {
      newGameStatus = 'won';
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      newGameStatus = 'lost';
    }

    if (newGameStatus !== 'playing' && user) {
      saveGameResult({
        uid: user.uid,
        nickname: nickname || user.displayName || user.email?.split('@')[0] || '익명',
        isWin: newGameStatus === 'won',
        guesses: newGuesses,
        gameDate,
        mode,
        countsForPracticeLeaderboard: isPracticeLeaderboardEligible,
      }).catch((error) => {
        console.error('게임 결과 저장 실패:', error);
      });
    }

    setGameState({
      ...gameState,
      guesses: newGuesses,
      currentGuess: [],
      gameStatus: newGameStatus,
      letterStatuses: newLetterStatuses,
      selectedGens,
    });
  }, [
    currentGuess,
    gameDate,
    gameState,
    gameStatus,
    guesses,
    hasSharedPracticeTarget,
    isGameOver,
    isPracticeLeaderboardEligible,
    letterStatuses,
    mode,
    nickname,
    selectedGens,
    targetJamo,
    targetJamoLength,
    user,
  ]);

  const resetGame = useCallback(() => {
    if (mode === 'practice' && !hasSharedPracticeTarget) {
      localStorage.removeItem('randomPokemon');
    }

    setGameState(
      createInitialState({
        mode,
        selectedGens,
        practiceTargetIndex,
      })
    );
  }, [hasSharedPracticeTarget, mode, practiceTargetIndex, selectedGens]);

  return (
    <GameContext.Provider
      value={{
        targetPokemon,
        targetJamoLength,
        currentGuess,
        guesses,
        gameStatus,
        gameDate,
        letterStatuses,
        handleKeyInput,
        submitGuess,
        resetGame,
        isGameOver,
        mode,
        selectedGens,
        setSelectedGens,
        isPracticeLeaderboardEligible,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
