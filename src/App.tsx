import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import Game from './components/Game';

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Layout>
          <Game />
        </Layout>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;