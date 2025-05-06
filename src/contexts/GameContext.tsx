import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getPokemonOfTheDay, getRandomPokemon, DISASSEMBLED_POKEMON_SET, getDisassembledSetForGens, getPokemonByIndex, getRandomPokemonIndex } from '../utils/pokemon';
import { formatDate } from '../utils/date';
import { decomposeHangul} from '../utils/korean';
import { decodeTarget, decodeIndex } from '../utils/encodings'

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
  selectedGens?: number[]; 
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
  selectedGens: number[]; 
  setSelectedGens: React.Dispatch<React.SetStateAction<number[]>>; 
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const MAX_ATTEMPTS = 6;

const createInitialState = (mode: 'daily' | 'practice' = 'daily', selectedGens: number[] = []): GameState => {
  let targetPokemon: string; 
  if (mode === 'practice') {
    if (selectedGens.length === 0) {
      alert('선택한 세대가 없습니다! 최소 한 세대를 선택해주세요.');
      // fallback으로 임시값 반환 (게임은 못하게 막음)
      return {
        targetPokemon: '',
        targetJamo: [],
        guesses: [],
        currentGuess: [],
        gameStatus: 'lost', // 혹은 'playing' 유지
        gameDate: formatDate(new Date()),
        maxAttempts: MAX_ATTEMPTS,
        letterStatuses: {},
      };
    }

    const queryTarget = new URLSearchParams(window.location.search).get('target');
    const gensToUse = selectedGens.length ? selectedGens : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (queryTarget) {
      const index = decodeIndex(queryTarget);
      targetPokemon = getPokemonByIndex(index);
    } 
    else {
      targetPokemon = getRandomPokemon(gensToUse);
    }

    // naive한 base 64 기반 인코딩 링크 디코딩해서 불러오기
    /*
    const queryTarget = new URLSearchParams(window.location.search).get('target');
    const storedGens = JSON.parse(localStorage.getItem('selectedGens') || '[]');
    const fallbackGens = [1,2,3,4,5,6,7,8,9]; // default to all gens
    const gensToUse = storedGens.length ? storedGens : fallbackGens;
    
    targetPokemon = queryTarget
      ? decodeTarget(queryTarget)
      : getRandomPokemon(gensToUse);
    */

  }
  else {
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

  /*
  const [selectedGens, setSelectedGens] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]); 
  */

  const savedGens = (() => {
    try {
      return JSON.parse(localStorage.getItem('selectedGens') || '[]');
    } 
    catch {
      return [];
    }
  })();
  
  const [selectedGens, setSelectedGens] = useState<number[]>(savedGens);

  /*
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
  */

  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const today = formatDate(new Date());
  
        const isSameGen = JSON.stringify(parsedState.selectedGens || []) === JSON.stringify(savedGens);
  
        const isValidDaily = mode === 'daily' && parsedState.gameDate === today;
        const isValidPractice = mode === 'practice' && isSameGen;
  
        if (
          parsedState &&
          parsedState.targetPokemon &&
          parsedState.targetJamo &&
          (isValidDaily || isValidPractice)
        ) {
          return parsedState;
        }
      } catch (err) {
        console.error('Error parsing game state:', err);
      }
    }
  
    return createInitialState(mode, savedGens);
  });

  const validDisassembledSetRef = useRef<Set<string>>(DISASSEMBLED_POKEMON_SET);

  // 연습 모드일 경우, 선택된 세대 기준으로 유효 포켓몬 세트 설정
  useEffect(() => {
    if (mode === 'practice') {
      validDisassembledSetRef.current = getDisassembledSetForGens(selectedGens);
    } 
    else {
      validDisassembledSetRef.current = DISASSEMBLED_POKEMON_SET;
    }
  }, [mode, selectedGens]);


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
    // UX를 더 신경 쓴 버전
    const isInSelectedGens = validDisassembledSetRef.current.has(disassembledInput);
    const isInAllGens = DISASSEMBLED_POKEMON_SET.has(disassembledInput);

    if (!isInSelectedGens) {
      if (isInAllGens) {
        alert('선택한 세대의 포켓몬이 아닙니다!');
      } else {
        alert('등록되지 않은 포켓몬입니다!');
      }
      return;
    }

    /*
    // 세대 구분 했을 때 Set 캐싱하는 경우 v3
    if (!validDisassembledSetRef.current.has(disassembledInput)) {
      alert('등록되지 않은 포켓몬입니다!');
      return;
    }
    */ 
    
    // 세대 구분 했을 때 캐싱 없어서 분해 Set 계속 만드는 경우 v2
    /* 
    let validSet: Set<string> = DISASSEMBLED_POKEMON_SET;

    if (mode === 'practice') {
      const gens = JSON.parse(localStorage.getItem('selectedGens') || '[]');
      validSet = getDisassembledSetForGens(gens);
    }

    if (!validSet.has(disassembledInput)) {
      alert('등록되지 않은 포켓몬입니다!');
      return;
    }
    */ 

    // 세대 별로 구분 안했을 때 v1
    /*
    const disassembledInput = currentGuess.join('');
    if (!DISASSEMBLED_POKEMON_SET.has(disassembledInput)) {
      alert('등록되지 않은 포켓몬입니다!');
      return;
    }
    */

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
      letterStatuses: newLetterStatuses,
      selectedGens
    });
  }, [currentGuess, gameState, guesses, isGameOver, letterStatuses, targetJamo, targetJamoLength, targetPokemon]);

  const resetGame = useCallback(() => {
    if (mode === 'practice') {
      localStorage.removeItem('randomPokemon');
    }
    setGameState(createInitialState(mode, selectedGens));
  }, [mode, selectedGens]);

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
      mode,
      selectedGens,
      setSelectedGens
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