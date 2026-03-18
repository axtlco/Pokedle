import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, nickname, updateNickname } = useAuth();
  const [input, setInput] = useState(nickname);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    const trimmed = input.trim();

    if (!trimmed) {
      setMessage('닉네임을 입력해 주세요.');
      return;
    }

    if (trimmed.length > 12) {
      setMessage('닉네임은 12자 이하로 입력해 주세요.');
      return;
    }

    if (trimmed === nickname) {
      onClose();
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await updateNickname(trimmed);
      setMessage('닉네임이 변경되었습니다!');
      setTimeout(onClose, 800);
    } catch (error) {
      if (error instanceof Error && error.message === 'nickname-already-in-use') {
        setMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setMessage('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="프로필" onClose={onClose}>
      <div className="space-y-4 text-black dark:text-white">
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || '-'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">닉네임</label>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={12}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="리더보드에 표시할 닉네임"
          />
          <p className="text-xs text-gray-400 mt-1">{input.length}/12자</p>
        </div>

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes('오류') || message.includes('사용 중')
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
