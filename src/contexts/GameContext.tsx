import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPokemonOfTheDay, getRandomPokemon, DISASSEMBLED_POKEMON_SET, getPokemonByIndex, getRandomPokemonIndex } from '../utils/pokemon';
import { formatDate } from '../utils/date';
import { decomposeHangul} from '../utils/korean';
import { decodeTarget } from '../utils/encodings'

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
  mode : 'daily' | 'practice'; 
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const MAX_ATTEMPTS = 6;

const createInitialState = (mode: 'daily' | 'practice' = 'daily'): GameState => {
  let targetPokemon: string; 
  if (mode === 'practice') {
    const queryTarget = new URLSearchParams(window.location.search).get('target');
    targetPokemon = queryTarget ? decodeTarget(queryTarget) : getRandomPokemon();
  } else {
    targetPokemon = getPokemonOfTheDay();
  }

  /*
  const targetPokemon = 
    mode === 'practice'
      ? getRandomPokemon()
      : getPokemonOfTheDay();
  */ 

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

export const GameProvider: React.FC<{ children: React.ReactNode, mode?: 'daily' | 'practice' }> = ({ children, mode = 'daily' }) => {
  const STORAGE_KEY = mode === 'practice' ? 'practiceGameState' : 'gameState';
  const [gameState, setGameState] = useState<GameState>(() => {
    if(mode === 'practice') {
      return createInitialState('practice'); 
    }
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState && 
            parsedState.gameDate === formatDate(new Date()) && 
            parsedState.targetPokemon && 
            parsedState.targetJamo) {
          return parsedState;
        }
      }
    } 
    catch (error) {
      console.error('Error loading saved game state:', error);
    }
    
    return createInitialState();
  });

  const { targetPokemon, targetJamo, guesses, currentGuess, gameStatus, gameDate, letterStatuses } = gameState;

  const targetJamoLength = targetJamo.length;
  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState, STORAGE_KEY]);

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

    const disassembledInput = currentGuess.join('');
    if (!DISASSEMBLED_POKEMON_SET.has(disassembledInput)) {
      alert('등록되지 않은 포켓몬입니다!');
      return;
    }

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

    if (currentGuess.join('') === targetJamo.join('')) {
      newGameStatus = 'won';
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      newGameStatus = 'lost';
    }
    
    /** 
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
    */ 

    setGameState({
      ...gameState,
      guesses: newGuesses,
      currentGuess: [],
      gameStatus: newGameStatus,
      letterStatuses: newLetterStatuses
    });
  }, [currentGuess, gameState, guesses, isGameOver, letterStatuses, targetJamo, targetJamoLength, targetPokemon]);

  const resetGame = useCallback(() => {
    if (mode === 'practice') {
      localStorage.removeItem('randomPokemon');
    }
    setGameState(createInitialState(mode));
  }, [mode]);

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
      isGameOver,
      mode
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