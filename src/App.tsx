import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import GamePage from './pages/GamePage';
import PracticePage from './pages/PracticePage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
