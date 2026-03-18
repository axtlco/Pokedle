import { isPreviousDate } from './date';

export interface StoredGameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastCompletedDate: string | null;
}

const STORAGE_KEY = 'gameStats';

export const DEFAULT_STORED_GAME_STATS: StoredGameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastCompletedDate: null,
};

const sanitizeGuessDistribution = (value: unknown): number[] => {
  if (!Array.isArray(value) || value.length !== 6) {
    return [...DEFAULT_STORED_GAME_STATS.guessDistribution];
  }

  return value.map((count) => (typeof count === 'number' && count >= 0 ? count : 0));
};

export const loadStoredGameStats = (): StoredGameStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STORED_GAME_STATS };
    }

    const parsed = JSON.parse(raw) as Partial<StoredGameStats>;

    return {
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
      gamesWon: typeof parsed.gamesWon === 'number' ? parsed.gamesWon : 0,
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      maxStreak: typeof parsed.maxStreak === 'number' ? parsed.maxStreak : 0,
      guessDistribution: sanitizeGuessDistribution(parsed.guessDistribution),
      lastCompletedDate:
        typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : null,
    };
  } catch {
    return { ...DEFAULT_STORED_GAME_STATS };
  }
};

export const saveStoredDailyGameStats = ({
  gameStatus,
  guessesLength,
  gameDate,
}: {
  gameStatus: 'playing' | 'won' | 'lost';
  guessesLength: number;
  gameDate: string;
}): StoredGameStats | null => {
  if (gameStatus === 'playing') {
    return null;
  }

  const current = loadStoredGameStats();

  if (current.lastCompletedDate === gameDate) {
    return current;
  }

  const nextStats: StoredGameStats = {
    ...current,
    guessDistribution: [...current.guessDistribution],
    gamesPlayed: current.gamesPlayed + 1,
    lastCompletedDate: gameDate,
  };

  if (gameStatus === 'won') {
    nextStats.gamesWon += 1;

    if (guessesLength >= 1 && guessesLength <= 6) {
      nextStats.guessDistribution[guessesLength - 1] += 1;
    }

    nextStats.currentStreak = isPreviousDate(current.lastCompletedDate, gameDate)
      ? current.currentStreak + 1
      : 1;
    nextStats.maxStreak = Math.max(current.maxStreak, nextStats.currentStreak);
  } else {
    nextStats.currentStreak = 0;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStats));

  return nextStats;
};
