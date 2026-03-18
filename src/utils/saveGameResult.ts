import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isPreviousDate } from './date';
import { normalizeNickname } from './nickname';

interface SaveGameResultOptions {
  uid: string;
  nickname: string;
  isWin: boolean;
  guesses: {
    jamo: string[];
    statuses: ('empty' | 'filled' | 'correct' | 'present' | 'absent')[];
  }[];
  gameDate: string;
  mode: 'daily' | 'practice';
  countsForPracticeLeaderboard?: boolean;
}

export async function saveGameResult({
  uid,
  nickname,
  isWin,
  guesses,
  gameDate,
  mode,
  countsForPracticeLeaderboard = false,
}: SaveGameResultOptions) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const prevData = userSnap.exists() ? userSnap.data() : {};
  const nicknameKey = normalizeNickname(nickname);

  if (mode === 'daily') {
    if (prevData.lastCompletedDate === gameDate) {
      await setDoc(
        userRef,
        {
          uid,
          nickname,
          nicknameKey,
          updatedAt: new Date(),
          lastPlayedAt: new Date(),
        },
        { merge: true }
      );
      return;
    }

    const recentStreak = isWin
      ? isPreviousDate(prevData.lastCompletedDate, gameDate)
        ? (prevData.recentStreak || 0) + 1
        : 1
      : 0;
    const winCount = (isWin ? 1 : 0) + (prevData.winCount || 0);
    const totalCount = 1 + (prevData.totalCount || 0);
    const maxStreak = Math.max(prevData.maxStreak || 0, recentStreak);
    const guessDistribution: number[] = [...(prevData.guessDistribution || [0, 0, 0, 0, 0, 0])];

    if (isWin && guesses.length >= 1 && guesses.length <= 6) {
      guessDistribution[guesses.length - 1] += 1;
    }

    await setDoc(
      userRef,
      {
        uid,
        nickname,
        nicknameKey,
        winCount,
        totalCount,
        recentStreak,
        maxStreak,
        guessDistribution,
        lastCompletedDate: gameDate,
        updatedAt: new Date(),
        lastPlayedAt: new Date(),
      },
      { merge: true }
    );

    const resultRef = doc(db, 'game_results', `${uid}_${gameDate}`);
    await setDoc(resultRef, {
      uid,
      nickname,
      date: gameDate,
      result: isWin ? 'won' : 'lost',
      guesses,
      createdAt: new Date(),
    });
    return;
  }

  if (!countsForPracticeLeaderboard) {
    await setDoc(
      userRef,
      {
        uid,
        nickname,
        nicknameKey,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    return;
  }

  const practiceStreak = isWin ? (prevData.practiceStreak || 0) + 1 : 0;
  const practiceMaxStreak = Math.max(prevData.practiceMaxStreak || 0, practiceStreak);

  await setDoc(
    userRef,
    {
      uid,
      nickname,
      nicknameKey,
      practiceStreak,
      practiceMaxStreak,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}
