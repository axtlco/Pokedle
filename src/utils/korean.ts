// Hangul Jamo utilities
export const decomposeHangul = (char: string): string[] => {
  if (!/^[가-힣]$/.test(char)) return [char];
  
  const code = char.charCodeAt(0) - 0xAC00;
  
  const jong = code % 28;
  const jung = (code - jong) / 28 % 21;
  const cho = ((code - jong) / 28 - jung) / 21;
  
  const result = [
    String.fromCharCode(0x1100 + cho),
    String.fromCharCode(0x1161 + jung)
  ];
  
  if (jong > 0) {
    result.push(String.fromCharCode(0x11A7 + jong));
  }
  
  return result;
};

export const composeHangul = (jamo: string[]): string => {
  if (jamo.length < 2) return jamo[0] || '';
  
  const cho = jamo[0].charCodeAt(0) - 0x1100;
  const jung = jamo[1].charCodeAt(0) - 0x1161;
  const jong = jamo[2] ? jamo[2].charCodeAt(0) - 0x11A7 : 0;
  
  const code = 0xAC00 + (cho * 21 + jung) * 28 + jong;
  return String.fromCharCode(code);
};

export const isConsonant = (char: string): boolean => {
  return /^[ㄱ-ㅎ]$/.test(char);
};

export const isVowel = (char: string): boolean => {
  return /^[ㅏ-ㅣ]$/.test(char);
};