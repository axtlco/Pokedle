import React from 'react';
import Modal from './Modal';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <Modal title="게임 방법" onClose={onClose}>
      <div className="space-y-4 text-black dark:text-white">
        <p>
          포켓몬 워들은 숨겨진 포켓몬의 한글 이름을 맞추는 게임입니다.
        </p>
        
        <section>
          <h3 className="font-bold text-lg mb-2">게임 규칙</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>매일 새로운 포켓몬이 선정됩니다.</li>
            <li>포켓몬의 이름 길이에 맞춰 추측해보세요.</li>
            <li>각 추측 후에는 글자별로 결과가 표시됩니다.</li>
            <li>글자 길이는 자음과 모음을 풀었을 때 길이입니다.</li>
            <li>쌍자음과 쌍모음은 풀어서 적어주세요. </li>
            <li>예시: ㄲ → ㄱㄱ, ㅒ → ㅑㅣ</li>
            <li>총 6번의 기회가 있습니다.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="font-bold text-lg mb-2">색상 의미</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-correct rounded mr-3 flex items-center justify-center text-white font-bold">ㄱ</div>
              <span>올바른 글자, 올바른 위치</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-present rounded mr-3 flex items-center justify-center text-white font-bold">ㄴ</div>
              <span>올바른 글자, 잘못된 위치</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-absent rounded mr-3 flex items-center justify-center text-white font-bold">ㄷ</div>
              <span>포켓몬 이름에 없는 글자</span>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="font-bold text-lg mb-2">예시</h3>
          <p className="mb-2">정답이 "피츄"인 경우:</p>
          
          <div className="flex space-x-2 mb-2">
            <div className="w-8 h-8 border-2 bg-correct text-white rounded flex items-center justify-center font-bold">ㅍ</div>
            <div className="w-8 h-8 border-2 bg-present text-white rounded flex items-center justify-center font-bold">ㅠ</div>
            <div className="w-8 h-8 border-2 bg-absent text-white rounded flex items-center justify-center font-bold">ㄹ</div>
            <div className="w-8 h-8 border-2 bg-present text-white rounded flex items-center justify-center font-bold">ㅣ</div>
          </div>
          
          <p>"ㅍ"는 올바른 위치에 있고, "ㅣ"와 "ㅠ는 포켓몬 이름에 있지만 위치가 잘못되었으며, "ㄹ"는 이름에 없습니다.</p>
        </section>
      </div>
    </Modal>
  );
};

export default HelpModal;