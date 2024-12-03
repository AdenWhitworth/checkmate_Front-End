import { useState, useEffect, useCallback } from 'react';
import { query, collection, orderBy, where, onSnapshot, QuerySnapshot, or } from 'firebase/firestore';
import { db } from '../../firebase';
import { UseTrackGamesOutput } from './useTrackGamesTypes';
import { Game } from '../../Providers/GameProvider/GameProviderTypes';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';

/**
 * Custom React hook to track games played by the current player, including regular and bot games.
 * Fetches games from Firestore and listens for real-time updates.
 *
 * @returns {UseTrackGamesOutput} Object containing the played games, played bot games, loading state, and error message.
 */
export const useTrackGames = (): UseTrackGamesOutput => {
  const [playedGames, setPlayedGames] = useState<Game[]>([]);
  const [playedBotGames, setPlayedBotGames] = useState<Game[]>([]);
  const [loadingPlayedGames, setLoadingPlayedGames] = useState<boolean>(true);
  const [loadingPlayedBotGames, setLoadingPlayedBotGames] = useState<boolean>(true);
  const [playedGamesloading, setPlayedGamesloading] = useState<boolean>(true);
  const [playedGamesError, setPlayedGamesError] = useState<string | null>(null);
  const { playerStatic } = usePlayer();

  /**
   * Checks if all loading states are complete and sets `loading` to false if so.
   */
  const checkAllLoaded = useCallback(() => {
    if (!loadingPlayedGames && !loadingPlayedBotGames) {
      setPlayedGamesloading(false);
    }
  }, [loadingPlayedGames, loadingPlayedBotGames]);

  /**
   * Fetches the list of games played by the current user from the "games" Firestore collection.
   * Listens for real-time updates and updates the `playedGames` state.
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
    const gamesQuery = query(
      gamesCollection,
      or(
        where("playerA.userId", "==", playerStatic.userId),
        where("playerB.userId", "==", playerStatic.userId)
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribeGames = onSnapshot(
      gamesQuery,
      (snapshot: QuerySnapshot) => {
        const games: Game[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            gameId: doc.id,
            playerA: data.playerA || {},
            playerB: data.playerB || {},
            fen: data.fen || '',
            history: data.history || [],
            currentTurn: data.currentTurn || 'w',
            status: data.status || 'waiting',
            winner: data.winner || null,
            lastMoveTime: data.lastMoveTime || null,
            createdAt: data.createdAt || null,
          };
        });

        setPlayedGames(games);
        setLoadingPlayedGames(false);
      },
      (error) => {
        setPlayedGamesError(`Error fetching games: ${error.message}`);
        setLoadingPlayedGames(false);
      }
    );

    return unsubscribeGames;
  }, [playerStatic]);

  /**
   * Fetches the list of bot games played by the current user from the "botGames" Firestore collection.
   * Listens for real-time updates and updates the `playedBotGames` state.
   *
   * @returns {() => void} A function to unsubscribe from the Firestore snapshot listener.
   */
  const fetchPlayedBotGames = useCallback(() => {
    if (!playerStatic) {
      setPlayedGamesError("Player data is not available.");
      setLoadingPlayedBotGames(false);
      return;
    }

    setLoadingPlayedBotGames(true);
    setPlayedGamesError(null);

    const botGamesCollection = collection(db, 'botGames');
    const botGamesQuery = query(
      botGamesCollection,
      where("playerA.userId", "==", playerStatic.userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeBotGames = onSnapshot(
      botGamesQuery,
      (snapshot: QuerySnapshot) => {
        const botGames: Game[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            gameId: doc.id,
            playerA: data.playerA || {},
            playerB: data.playerB || {},
            fen: data.fen || '',
            history: data.history || [],
            currentTurn: data.currentTurn || 'w',
            status: data.status || 'waiting',
            winner: data.winner || null,
            lastMoveTime: data.lastMoveTime || null,
            createdAt: data.createdAt || null,
          };
        });

        setPlayedBotGames(botGames);
        setLoadingPlayedBotGames(false);
      },
      (error) => {
        setPlayedGamesError(`Error fetching bot games: ${error.message}`);
        setLoadingPlayedBotGames(false);
      }
    );

    return unsubscribeBotGames;
  }, [playerStatic]);
  
  /**
   * Subscribe to games collections for realtime updates and unsubscribe on unmount
   */
  useEffect(() => {
    const unsubscribeGames = fetchPlayedGames();
    const unsubscribeBotGames = fetchPlayedBotGames();

    return () => {
      if (unsubscribeGames) unsubscribeGames();
      if (unsubscribeBotGames) unsubscribeBotGames();
    };
  }, [fetchPlayedGames, fetchPlayedBotGames]);

  /**
   * Continually check if all games have been loaded
   */
  useEffect(() => {
    checkAllLoaded();
  }, [loadingPlayedGames, loadingPlayedBotGames, checkAllLoaded]);

  return {
    playedGames,
    playedBotGames,
    playedGamesloading,
    playedGamesError,
  };
};