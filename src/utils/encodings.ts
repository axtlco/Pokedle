export const encodeTarget = (pokemon: string): string => {
    return btoa(unescape(encodeURIComponent(pokemon)));
};
  
export const decodeTarget = (encoded: string): string => {
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } 
    catch (e) {
      return '';
    }
};

// 인덱스 기반 URL 추출
export const encodeIndex = (index: number): string => {
    return index.toString(36); // base36 인코딩 (0-9 + a-z)
  };
  
  export const decodeIndex = (encoded: string): number => {
    return parseInt(encoded, 36);
  };
  
  