import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  showGenSelect: boolean;
  toggleShow: () => void;
  selectedGens: number[];
  toggleGen: (gen: number) => void;
}

const GenToggleButton: React.FC<Props> = ({ showGenSelect, toggleShow, selectedGens, toggleGen }) => {
  return (
    <>
      <button
        onClick={toggleShow}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
      >
        <ChevronDown size={18} />
        <span>세대 선택</span>
      </button>

      {showGenSelect && (
        <div className="space-y-1 px-3 pb-3 pt-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((gen) => {
            const isSelected = selectedGens.includes(gen);
            return (
              <label
                key={gen}
                className="flex items-center justify-between gap-4 cursor-pointer py-1"
              >
                <span className="text-sm text-gray-800 dark:text-white">{gen}세대</span>

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleGen(gen)}
                  className="sr-only"
                />

                <div
                  className={`w-10 h-6 flex items-center rounded-full px-1 transition duration-300 ease-in-out ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ${
                      isSelected ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            );
          })}
        </div>
      )}
    </>
  );
};

export default GenToggleButton;
