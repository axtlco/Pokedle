import Hangul from 'hangul-js';

// 쌍자음 및 쌍모음 변환 맵
const replaceMap: { [key: string]: string } = {
  ㄲ: 'ㄱㄱ',
  ㄸ: 'ㄷㄷ',
  ㅃ: 'ㅂㅂ',
  ㅆ: 'ㅅㅅ',
  ㅉ: 'ㅈㅈ',
  ㅒ: 'ㅑㅣ',
  ㅖ: 'ㅕㅣ',
};

/**
 * 한 글자 또는 전체 문자열을 자모 단위로 분해하고,
 * 쌍자음/쌍모음을 풀어주는 확장된 버전
 */
export const decomposeHangul = (text: string): string[] => {
  const decomposed = Hangul.disassemble(text);
  const expanded: string[] = [];

  for (const char of decomposed) {
    if (replaceMap[char]) {
      // 대응되는 값 문자열을 문자 배열로 쪼개서 추가
      expanded.push(...replaceMap[char]);
    } else {
      expanded.push(char);
    }
  }

  return expanded;
};

/**
 * 자모 배열을 한글 문자열로 조합
 */
export const composeHangul = (jamo: string[]): string => {
  return Hangul.assemble(jamo);
};

/**
 * 자음인지 확인 (ㄱ~ㅎ)
 */
export const isConsonant = (char: string): boolean => /^[ㄱ-ㅎ]$/.test(char);

/**
 * 모음인지 확인 (ㅏ~ㅣ)
 */
export const isVowel = (char: string): boolean => /^[ㅏ-ㅣ]$/.test(char);
