import { Trophy } from 'lucide-react';

interface Props {
  onClick: () => void;
}

const LeaderboardButton: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-800 dark:text-white"
  >
    <Trophy size={18} />
    <span>리더보드</span>
  </button>
);

export default LeaderboardButton;
