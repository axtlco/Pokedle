import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import Layout from '../components/Layout';
import Game from '../components/Game';

const PracticePage = () => (
  <GameProvider mode="practice">
    <Layout>
      <Game />
    </Layout>
  </GameProvider>
);

export default PracticePage;
