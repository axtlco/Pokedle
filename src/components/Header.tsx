import React, { useState } from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';
import HelpModal from './modals/HelpModal';
import StatsModal from './modals/StatsModal';

const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <header className="py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-red dark:hover:text-pokemon-red"
          aria-label="Instructions"
        >
          <HelpCircle size={24} />
        </button>
        
        <h1 className="text-xl md:text-2xl font-bold text-pokemon-red dark:text-pokemon-red flex items-center">
          <img src="/pokeball.svg" alt="Pokeball" className="w-8 h-8 mr-2" />
          포켓들 Pokedle
        </h1>
        
        <button
          onClick={() => setShowStats(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-pokemon-blue dark:hover:text-pokemon-blue"
          aria-label="Statistics"
        >
          <BarChart2 size={24} />
        </button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </header>
  );
};

export default Header;