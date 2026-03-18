import React, { useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase';

interface Props {
  onClose: () => void;
}

const getAuthErrorMessage = (
  error: unknown,
  mode: 'login' | 'register' | 'google'
): string | null => {
  if (!(error instanceof FirebaseError)) {
    if (mode === 'google') {
      return '구글 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }

    return mode === 'login'
      ? '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
      : '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }

  switch (error.code) {
    case 'auth/user-not-found':
      return '해당 이메일로 등록된 계정이 없습니다.';
    case 'auth/invalid-email':
      return '올바른 이메일 주소를 입력해 주세요.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '비밀번호가 일치하지 않습니다.';
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/popup-closed-by-user':
      return '로그인이 취소되었습니다.';
    case 'auth/cancelled-popup-request':
      return null;
    default:
      if (mode === 'google') {
        return '구글 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.';
      }

      return mode === 'login'
        ? '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
        : '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
};

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogin = async () => {
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setError(getAuthErrorMessage(error, 'login'));
    }
  };

  const handleRegister = async () => {
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      const message = getAuthErrorMessage(error, 'register');

      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setMode('login');
      }

      setError(message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setError(getAuthErrorMessage(error, 'google'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
          {mode === 'login' ? '로그인' : '회원가입'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="이메일"
          className="w-full mb-2 px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full mb-4 px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {mode === 'login' ? (
          <>
            <button
              onClick={handleLogin}
              className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              이메일로 로그인
            </button>
            <p className="text-sm text-center text-gray-500">
              아직 계정이 없으신가요?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-blue-600 hover:underline"
              >
                회원가입
              </button>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={handleRegister}
              className="w-full mb-2 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              회원가입
            </button>
            <p className="text-sm text-center text-gray-500">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-blue-600 hover:underline"
              >
                로그인
              </button>
            </p>
          </>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          구글로 로그인
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
