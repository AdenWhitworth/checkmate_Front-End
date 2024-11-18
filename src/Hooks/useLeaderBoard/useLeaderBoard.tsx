import { useState, useEffect, useCallback } from 'react';
import { LeaderBoardPlayer } from './useLeaderBoardTypes';
import { query, collection, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { UseLeaderBoardOutput } from './useLeaderBoardTypes';

/**
 * Custom hook to fetch and track the leaderboard from Firestore in real-time.
 *
 * @returns {UseLeaderBoardOutput} An object containing leaderboard players, loading state, and error state.
 */
export const useLeaderBoard = (): UseLeaderBoardOutput => {
  const [leaderBoardPlayers, setLeaderBoardPlayers] = useState<LeaderBoardPlayer[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState<boolean>(true);
  const [leadersError, setLeadersError] = useState<string | null>(null);

  /**
   * Fetches the leaderboard data from Firestore and subscribes to real-time updates.
   */
  const fetchLeaderBoard = useCallback(() => {
    setLoadingLeaders(true);
    setLeadersError(null);

    const q = query(collection(db, 'users'), orderBy('elo', 'desc'), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const players = snapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
          elo: doc.data().elo,
        }));
        setLeaderBoardPlayers(players);
        setLoadingLeaders(false);
      },
      (error) => {
        setLeadersError(`Error fetching leaderboard: ${error.message}`);
        setLoadingLeaders(false);
      }
    );

    return unsubscribe;
  }, []);

  /**
   * Effect to fetch and listen to leaderboard updates from Firestore in real-time.
   */
  useEffect(() => {
    const unsubscribe = fetchLeaderBoard();
    return () => {
      unsubscribe();
    };
  }, [fetchLeaderBoard]);

  return { leaderBoardPlayers, loadingLeaders, leadersError };
};