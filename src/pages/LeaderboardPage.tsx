import React from 'react';
import Leaderboard from '../components/leaderboard/Leaderboard';
import Layout from '../components/Layout';
import { GameProvider } from '../contexts/GameContext';
/*
const LeaderboardPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Leaderboard />
    </main>
  );
};
*/ 

const LeaderboardPage: React.FC = () => {
    return (
      <GameProvider mode="daily">
        <Layout>
            <Leaderboard />
        </Layout>
      </GameProvider>
    );
  };

export default LeaderboardPage;
