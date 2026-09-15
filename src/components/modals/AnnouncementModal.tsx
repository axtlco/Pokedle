import React from 'react';
import Modal from './Modal';

interface AnnouncementModalProps {
  onClose: () => void;
  onHideToday: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ onClose, onHideToday }) => (
  <Modal title="공지" onClose={onClose}>
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      <p className="leading-relaxed break-keep">
        방문해주셔서 감사합니다😀
        <br />
        어디서 오셨는지는 모르지만 즐겁게 플레이해주세요
        <br />
        개선사항은 감사히 받고 있습니다{' '}
        <a className="text-blue-600 dark:text-blue-400 underline break-all" href="mailto:axtlz47@gmail.com">
          axtlz47@gmail.com
        </a>
      </p>
      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        확인
      </button>
      <button
        type="button"
        onClick={onHideToday}
        className="w-full rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        오늘 하루 안 보기
      </button>
    </div>
  </Modal>
);

export default AnnouncementModal;
