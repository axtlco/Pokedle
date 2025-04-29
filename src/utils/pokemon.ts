import { format, differenceInDays } from 'date-fns';

// Sample list of Korean Pokemon names
// In a real app, this would be a much larger list
const POKEMON_LIST = [
  '피카츄', '라이츄', '파이리', '꼬부기', '버터플', '야도란', '고라파덕', 
  '피죤투', '또가스', '뮤츠', '잠만보', '망나뇽', '푸린', '이상해씨', '이브이',
  '팬텀', '뮤', '레쿠쟈', '루기아', '코일', '고오스', '우츠동', '윈디', '파오리',
  '내루미', '질퍽이', '또도가스', '야돈', '에레키드', '마그마', '쥬쥬', '찌리리공',
  '이상해풀', '이상해꽃', '리자드', '리자몽', '어니부기', '거북왕', '캐터피',
  '메타몽', '포니타', '갸라도스', '켄타로스', '라프라스', '가디안', '야도킹'
];

// Get a pokemon based on the day
export const getPokemonOfTheDay = (): string => {
  // Use the current date to get a consistent pokemon for each day
  const startDate = new Date('2023-01-01');
  const today = new Date();
  const dayDiff = differenceInDays(today, startDate);
  
  // Get pokemon based on the day number
  const pokemonIndex = dayDiff % POKEMON_LIST.length;
  return POKEMON_LIST[pokemonIndex];
};

// Get all possible pokemon (for validation)
export const getAllPokemon = (): string[] => {
  return POKEMON_LIST;
};

// Check if a word is a valid pokemon
export const isValidPokemon = (word: string): boolean => {
  return POKEMON_LIST.includes(word);
};