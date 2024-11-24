import { useState, useEffect, useCallback } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';
import { UseGlobalStatsOutput } from './useGlobalStatsTypes';

/**
 * Custom hook to fetch the global games and players count from Firestore.
 *
 * @returns {UseGlobalStatsOutput} An object containing global games count, loading state, and error state.
 */
export const useGlobalStats = (): UseGlobalStatsOutput => {
  const [globalGamesCount, setGlobalGamesCount] = useState<number | null>(null);
  const [loadingGlobalGamesCount, setLoadingGlobalGamesCount] = useState<boolean>(true);
  const [globalGamesCountError, setGlobalGamesCountError] = useState<string | null>(null);

  const [globalPlayersCount, setGlobalPlayersCount] = useState<number | null>(null);
  const [loadingGlobalPlayersCount, setLoadingGlobalPlayersCount] = useState<boolean>(true);
  const [globalPlayersCountError, setGlobalGamesPlayersError] = useState<string | null>(null);

  /**
   * Fetches the global games count from Firestore using `getCountFromServer`.
   */
  const fetchGlobalGamesCount = useCallback(async () => {
    setLoadingGlobalGamesCount(true);
    setGlobalGamesCountError(null);

    try {
      const gamesCollection = collection(db, 'games');
      const snapshot = await getCountFromServer(gamesCollection);
      setGlobalGamesCount(snapshot.data().count);
    } catch (error) {
      setGlobalGamesCountError(error instanceof Error ? error.message : 'Error counting the global games');
    } finally {
      setLoadingGlobalGamesCount(false);
    }
  }, []);

  /**
   * Effect to fetch the global games count when the hook is used.
   */
  useEffect(() => {
    fetchGlobalGamesCount();
  }, [fetchGlobalGamesCount]);

  /**
   * Fetches the global players count from Firestore using `getCountFromServer`.
   */
  const fetchGlobalPlayersCount = useCallback(async () => {
    setLoadingGlobalPlayersCount(true);
    setGlobalGamesPlayersError(null);

    try {
      const playersCollection = collection(db, 'players');
      const snapshot = await getCountFromServer(playersCollection);
      setGlobalPlayersCount(snapshot.data().count);
    } catch (error) {
        setGlobalGamesPlayersError(error instanceof Error ? error.message : 'Error counting the global players');
    } finally {
        setLoadingGlobalPlayersCount(false);
    }
  }, []);

  /**
   * Effect to fetch the global players count when the hook is used.
   */
  useEffect(() => {
    fetchGlobalPlayersCount();
  }, [fetchGlobalPlayersCount]);

  return { globalGamesCount, loadingGlobalGamesCount, globalGamesCountError, globalPlayersCount, loadingGlobalPlayersCount, globalPlayersCountError };
};
