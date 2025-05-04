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
  