import { addDays, format, parseISO } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getKoreanNow = (): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;

  return new Date(utc + 9 * 60 * 60_000);
};

export const getCurrentKoreanDateString = (): string => {
  return formatDate(getKoreanNow());
};

export const isPreviousDate = (
  previousDate: string | null | undefined,
  currentDate: string
): boolean => {
  if (!previousDate) {
    return false;
  }

  return formatDate(addDays(parseISO(currentDate), -1)) === previousDate;
};
