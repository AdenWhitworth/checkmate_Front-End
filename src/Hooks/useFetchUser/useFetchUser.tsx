import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Player } from './useFetchUserTypes';

export const useFetchUserData = (uid: string) => {
  const [playerData, setPlayerData] = useState<Player | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetchUserInfo = async () => {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setPlayerData({
          playerId: doc.data().playerID,
          userId: doc.id,
          username: doc.data().username,
          win: doc.data().win,
          loss: doc.data().loss,
        });
      });
    };

    fetchUserInfo();
  }, [uid]);

  return playerData;
};

