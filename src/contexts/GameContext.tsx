import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPokemonOfTheDay } from '../utils/pokemon';
import { formatDate } from '../utils/date';
import { decomposeHangul, composeHangul } from '../utils/korean';

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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const MAX_ATTEMPTS = 6;

const createInitialState = (): GameState => {
  const targetPokemon = getPokemonOfTheDay();
  const targetJamo = targetPokemon.split('').flatMap(char => decomposeHangul(char));
  
  return {
    targetPokemon,
    targetJamo,
    guesses: [],
    currentGuess: [],
    gameStatus: 'playing',
    gameDate: formatDate(new Date()),
    maxAttempts: MAX_ATTEMPTS,
    letterStatuses: {},
  };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState && 
            parsedState.gameDate === formatDate(new Date()) && 
            parsedState.targetPokemon && 
            parsedState.targetJamo) {
          return parsedState;
        }
      }
    } catch (error) {
      console.error('Error loading saved game state:', error);
    }
    
    return createInitialState();
  });

  const { targetPokemon, targetJamo, guesses, currentGuess, gameStatus, gameDate, letterStatuses } = gameState;

  const targetJamoLength = targetJamo.length;
  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const handleKeyInput = useCallback((key: string) => {
    if (isGameOver) return;

    setGameState(prevState => {
      if (key === 'Backspace' || key === '⌫') {
        return {
          ...prevState,
          currentGuess: prevState.currentGuess.slice(0, -1)
        };
      }
      
      if (/^[ㄱ-ㅎㅏ-ㅣ]$/.test(key) && prevState.currentGuess.length < targetJamoLength) {
        return {
          ...prevState,
          currentGuess: [...prevState.currentGuess, key]
        };
      }
      
      return prevState;
    });
  }, [isGameOver, targetJamoLength]);

  const submitGuess = useCallback(() => {
    if (isGameOver || currentGuess.length !== targetJamoLength) return;

    const evaluateGuess = (guess: string[], target: string[]): CellStatus[] => {
      const result: CellStatus[] = Array(guess.length).fill('absent');
      const targetChars = [...target];
      
      // First pass: check for correct positions
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === targetChars[i]) {
          result[i] = 'correct';
          targetChars[i] = '';
        }
      }
      
      // Second pass: check for correct letters in wrong positions
      for (let i = 0; i < guess.length; i++) {
        if (result[i] !== 'correct') {
          const targetIndex = targetChars.indexOf(guess[i]);
          if (targetIndex !== -1) {
            result[i] = 'present';
            targetChars[targetIndex] = '';
          }
        }
      }
      
      return result;
    };

    const statuses = evaluateGuess(currentGuess, targetJamo);
    const newGuess: GuessResult = { jamo: currentGuess, statuses };
    const newGuesses = [...guesses, newGuess];
    
    const newLetterStatuses = { ...letterStatuses };
    for (let i = 0; i < currentGuess.length; i++) {
      const char = currentGuess[i];
      const status = statuses[i];
      
      if (!newLetterStatuses[char] || 
          (newLetterStatuses[char] === 'absent' && (status === 'present' || status === 'correct')) ||
          (newLetterStatuses[char] === 'present' && status === 'correct')) {
        newLetterStatuses[char] = status;
      }
    }
    
    let newGameStatus = gameStatus;
    
    // Convert current guess Jamo array into Hangul characters
    const guessedChars: string[] = [];
    for (let i = 0; i < currentGuess.length; i += 2) {
      const jamoSlice = currentGuess.slice(i, i + 3);
      const char = composeHangul(jamoSlice);
      guessedChars.push(char);
    }
    const guessedWord = guessedChars.join('');
    
    // Check if the composed word matches the target Pokemon
    if (guessedWord === targetPokemon) {
      newGameStatus = 'won';
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      newGameStatus = 'lost';
    }
    
    setGameState({
      ...gameState,
      guesses: newGuesses,
      currentGuess: [],
      gameStatus: newGameStatus,
      letterStatuses: newLetterStatuses
    });
  }, [currentGuess, gameState, guesses, isGameOver, letterStatuses, targetJamo, targetJamoLength, targetPokemon]);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return (
    <GameContext.Provider value={{
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
      isGameOver
    }}>
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