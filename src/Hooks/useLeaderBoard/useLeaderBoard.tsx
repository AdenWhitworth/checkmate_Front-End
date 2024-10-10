import { useState, useEffect } from 'react';
import { LeaderBoardPlayer } from './useLeaderBoardTypes';
import { query, collection, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export const useLeaderBoard = () => {
  const [leaderBoardPlayers, setLeaderBoardPlayers] = useState<LeaderBoardPlayer[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState<boolean>(true);
  const [leadersError, setLeadersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderBoard = () => {
      setLoadingLeaders(true);
      setLeadersError(null);
      const q = query(collection(db, 'users'), orderBy('rank', 'desc'), limit(10));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const players = snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            win: doc.data().win,
            loss: doc.data().loss,
          }));
          setLeaderBoardPlayers(players);
          setLoadingLeaders(false);
        },
        (error) => {
          setLeadersError("Error fetching leaderboard");
          setLoadingLeaders(false);
        }
      );
      
      return unsubscribe;
    };
  
    fetchLeaderBoard();
  }, []);
  

  return { leaderBoardPlayers, loadingLeaders, leadersError };
};