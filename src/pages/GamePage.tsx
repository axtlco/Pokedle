import React, { useState } from 'react';
import { GameProvider } from '../contexts/GameContext';
import Layout from '../components/Layout';
import Game from '../components/Game';
import AnnouncementModal from '../components/modals/AnnouncementModal';

const ANNOUNCEMENT_HIDDEN_UNTIL_KEY = 'pokedle:announcement:hiddenUntil';

const GamePage = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    try {
      const hiddenUntil = Number(localStorage.getItem(ANNOUNCEMENT_HIDDEN_UNTIL_KEY));
      return !Number.isFinite(hiddenUntil) || hiddenUntil <= Date.now();
    } catch {
      return true;
    }
  });

  const hideAnnouncementToday = () => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    try {
      localStorage.setItem(ANNOUNCEMENT_HIDDEN_UNTIL_KEY, String(midnight.getTime()));
    } catch {
      // Still allow closing when browser storage is unavailable.
    }
    setShowAnnouncement(false);
  };

  return (
    <GameProvider mode="daily">
      <Layout>
        <Game inputDisabled={showAnnouncement} />
        {showAnnouncement && (
          <AnnouncementModal
            onClose={() => setShowAnnouncement(false)}
            onHideToday={hideAnnouncementToday}
          />
        )}
      </Layout>
    </GameProvider>
  );
};

export default GamePage;
