import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { normalizeNickname } from '../utils/nickname';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  nickname: string;
  updateNickname: (newNickname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  nickname: '',
  updateNickname: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists() && snapshot.data().nickname) {
          setNickname(snapshot.data().nickname);
        } else {
          const defaultNickname =
            firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '익명';
          setNickname(defaultNickname);
        }
      } else {
        setNickname('');
      }
    });

    return () => unsubscribe();
  }, []);

  const isNicknameTaken = async (candidateNickname: string, currentUid: string): Promise<boolean> => {
    const candidateKey = normalizeNickname(candidateNickname);
    const usersSnapshot = await getDocs(collection(db, 'users'));

    return usersSnapshot.docs.some((snapshot) => {
      if (snapshot.id === currentUid) {
        return false;
      }

      const existingNickname = snapshot.data().nickname;
      return typeof existingNickname === 'string' && normalizeNickname(existingNickname) === candidateKey;
    });
  };

  const updateNickname = async (newNickname: string) => {
    if (!user) {
      return;
    }

    const trimmedNickname = newNickname.trim();

    if (await isNicknameTaken(trimmedNickname, user.uid)) {
      throw new Error('nickname-already-in-use');
    }

    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        nickname: trimmedNickname,
        nicknameKey: normalizeNickname(trimmedNickname),
      },
      { merge: true }
    );

    setNickname(trimmedNickname);
  };

  return (
    <AuthContext.Provider value={{ user, loading, nickname, updateNickname }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
