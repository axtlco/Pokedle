export const normalizeNickname = (nickname: string): string => {
  return nickname.trim().toLocaleLowerCase('ko-KR');
};
