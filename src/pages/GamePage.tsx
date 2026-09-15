import React, { useState } from 'react';
import { GameProvider } from '../contexts/GameContext';
import Layout from '../components/Layout';
import Game from '../components/Game';
import AnnouncementModal from '../components/modals/AnnouncementModal';

const GamePage = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <GameProvider mode="daily">
      <Layout>
        <Game inputDisabled={showAnnouncement} />
        {showAnnouncement && (
          <AnnouncementModal onClose={() => setShowAnnouncement(false)} />
        )}
      </Layout>
    </GameProvider>
  );
};

export default GamePage;
