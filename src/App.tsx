import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import GamePage from './pages/GamePage';
import PracticePage from './pages/PracticePage';
import LeaderboardPage from './pages/LeaderboardPage'; 
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
