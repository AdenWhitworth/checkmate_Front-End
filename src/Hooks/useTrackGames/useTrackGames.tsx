import { useState, useEffect, useCallback } from 'react';
import { query, collection, orderBy, where, onSnapshot, QuerySnapshot, or } from 'firebase/firestore';
import { db } from '../../firebase';
import { UseTrackGamesOutput } from './useTrackGamesTypes';
import { Game } from '../../Providers/GameProvider/GameProviderTypes';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';

/**
 * Custom hook to track games played by the current player.
 * Fetches games from the Firestore database where the current player is either Player A or Player B.
 *
 * @returns {UseTrackGamesOutput} An object containing the list of played games, loading state, and any error message.
 */
export const useTrackGames = (): UseTrackGamesOutput => {
  const [playedGames, setPlayedGames] = useState<Game[]>([]);
  const [loadingPlayedGames, setLoadingPlayedGames] = useState<boolean>(true);
  const [playedGamesError, setPlayedGamesError] = useState<string | null>(null);
  const { playerStatic } = usePlayer();

  /**
   * Fetches the list of games played by the current user.
   * Uses Firestore queries to fetch games where the user's ID matches either `playerA.userId` or `playerB.userId`.
   *
   * @returns {() => void} A function to unsubscribe from the Firestore snapshot listener.
   */
  const fetchPlayedGames = useCallback(() => {
    if (!playerStatic) {
      setPlayedGamesError("Player data is not available.");
      setLoadingPlayedGames(false);
      return;
    }

    setLoadingPlayedGames(true);
    setPlayedGamesError(null);

    const gamesCollection = collection(db, 'games');
    const q = query(
        gamesCollection,
        or(
          where("playerA.userId", "==", playerStatic.userId),
          where("playerB.userId", "==", playerStatic.userId)
        ),
        orderBy("createdAt", "desc")
      );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const games: Game[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            gameId: doc.id,
            playerA: {
              userId: data.playerA?.userId ?? '',
              playerId: data.playerA?.playerId ?? '',
              username: data.playerA?.username ?? '',
              elo: data.playerA?.elo ?? 1200,
              orientation: data.playerA?.orientation ?? 'w',
              connected: data.playerA?.connected ?? false,
            },
            playerB: {
              userId: data.playerB?.userId ?? '',
              playerId: data.playerB?.playerId ?? '',
              username: data.playerB?.username ?? '',
              elo: data.playerB?.elo ?? 1200,
              orientation: data.playerB?.orientation ?? 'b',
              connected: data.playerB?.connected ?? false,
            },
            fen: data.fen ?? '',
            history: data.history ?? [],
            currentTurn: data.currentTurn ?? 'w',
            status: data.status ?? 'waiting',
            winner: data.winner ?? null,
            lastMoveTime: data.lastMoveTime ?? null,
            createdAt: data.createdAt ?? null,
          };
        });

        setPlayedGames(games);
        setLoadingPlayedGames(false);
      },
      (error) => {
        setPlayedGamesError(`Error fetching played games: ${error.message}`);
        setLoadingPlayedGames(false);
      }
    );

    return unsubscribe;
  }, [playerStatic]);

  /**
   * Effect to initialize the fetching of played games and set up a Firestore listener.
   * Cleans up the listener when the component using this hook unmounts or dependencies change.
   */
  useEffect(() => {
    const unsubscribe = fetchPlayedGames();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchPlayedGames]);

  return { playedGames, loadingPlayedGames, playedGamesError };
};
