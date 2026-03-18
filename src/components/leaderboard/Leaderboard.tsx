import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { LeaderboardEntry } from './types';
import LeaderboardRow from './LeaderboardRow';
import LeaderboardTabs from './LeaderboardTabs';

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<'streak' | 'winrate' | 'practiceStreak'>('streak');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const result: LeaderboardEntry[] = [];

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        if (!data.nickname) {
          return;
        }

        result.push({
          uid: snapshot.id,
          nickname: data.nickname,
          maxStreak: data.maxStreak || 0,
          practiceMaxStreak: data.practiceMaxStreak || 0,
          wins: data.winCount || 0,
          totalGames: data.totalCount || 0,
          winRate: data.totalCount ? (data.winCount / data.totalCount) * 100 : 0,
        });
      });

      setEntries(result);
    };

    fetchData();
  }, []);

  const sortedEntries = (() => {
    switch (mode) {
      case 'streak':
        return [...entries]
          .filter((entry) => entry.totalGames >= 1)
          .sort((left, right) => right.maxStreak - left.maxStreak);
      case 'winrate':
        return [...entries]
          .filter((entry) => entry.totalGames >= 1)
          .sort((left, right) => right.winRate - left.winRate);
      case 'practiceStreak':
        return [...entries]
          .filter((entry) => entry.practiceMaxStreak > 0)
          .sort((left, right) => right.practiceMaxStreak - left.practiceMaxStreak);
    }
  })();

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2 dark:text-white">
        리더보드
      </h1>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100">
        <p className="font-semibold mb-2">집계 규칙</p>
        <p>일일 연승은 연속 날짜 기준입니다. 하루를 건너뛰면 다음 승리부터 다시 1연승으로 시작합니다.</p>
        <p className="mt-2">
          연습 리더보드 연승은 1~9세대를 모두 선택한 연습 모드만 집계됩니다. 일부 세대만 선택한 게임과 그 결과는 연습 리더보드에 반영되지 않습니다.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <LeaderboardTabs mode={mode} setMode={setMode} />
      </div>

      <div className="space-y-2 mt-4">
        {sortedEntries.map((entry, index) => (
          <LeaderboardRow key={entry.uid} rank={index + 1} entry={entry} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
