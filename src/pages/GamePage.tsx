import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import Layout from '../components/Layout';
import Game from '../components/Game';

const GamePage = () => (
  <GameProvider mode="daily">
    <Layout>
      <Game />
    </Layout>
  </GameProvider>
);

export default GamePage;
