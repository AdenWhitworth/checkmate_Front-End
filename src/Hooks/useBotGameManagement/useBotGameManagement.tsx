import { useCallback } from 'react';
import { InGamePlayer } from '../../Providers/GameProvider/GameProviderTypes';
import { UseBotGameManagementOutput, UseBotGameManagementProps } from './useBotGameManagementTypes';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { BotGame } from '../../Providers/BotProvider/BotProviderTypes';

/**
 * Custom hook for managing a bot chess game. Provides functionality to create, forfeit, and close bot games.
 *
 * @param {UseBotGameManagementProps} props - The properties required by the hook.
 * @param {Function} props.cleanup - Function to clean up the current game state.
 * @param {BotGame | null} props.botGame - The current bot game object.
 * @param {Function} props.setBotGame - Function to update the bot game state.
 * @param {Function} props.setFen - Function to update the FEN string of the game.
 * @param {Function} props.setHistory - Function to update the move history of the game.
 * @param {Function} props.setOrientation - Function to set the player's orientation ("w" or "b").
 * @param {Function} props.setPlayerTurn - Function to update the player's turn.
 * @param {Function} props.setLoadingCreateGame - Function to set the loading state when creating a bot game.
 * @param {Function} props.setErrorCreateGame - Function to set the error message when creating a bot game.
 * @param {Function} props.setSuccessCreateGame - Function to set the success message when creating a bot game.
 * @param {"w" | "b"} props.orientation - The player's orientation in the game ("w" for white, "b" for black).
 * @param {"novice" | "intermediate" | "advanced" | "master"} props.difficulty - The difficulty level of the bot.
 * @param {string} props.help - The help level for the game (e.g., assisted or challenge mode).
 * @param {Function} props.setLoadingForfeit - Function to set the loading state when forfeiting a game.
 * @param {Function} props.setErrorForfeit - Function to set the error message when forfeiting a game.
 * @param {Function} props.setForfeitBotGame - Function to update the forfeit game state.
 * @param {Function} props.setErrorOver - Function to set the error message when closing a game.
 * @param {Function} props.setLoadingOver - Function to set the loading state when closing a game.
 * @param {Function} props.findWinner - Function to determine the winner of the game.
 * @returns {UseBotGameManagementOutput} - The returned functions for managing the bot chess game.
 */
export const useBotGameManagement = ({
    cleanup,
    botGame,
    setBotGame,
    setFen,
    setHistory,
    setOrientation,
    setPlayerTurn,
    setLoadingCreateGame,
    setErrorCreateGame,
    setSuccessCreateGame,
    orientation,
    difficulty,
    help,
    setLoadingForfeit,
    setErrorForfeit,
    setForfeitBotGame,
    setErrorOver,
    setLoadingOver,
    findWinner
}: UseBotGameManagementProps): UseBotGameManagementOutput => {
    
    const { 
        socketRef, 
        sendCreateBotGame,
        sendCloseBotGame,
    } = useSocket();
    const { playerStatic, playerDynamic, setPlayerDynamic } = usePlayer();

    /**
     * Creates a new bot chess game. Configures the players, sends a request to the server, and updates the game state.
     *
     * @async
     * @returns {Promise<void>} - Resolves when the game is created successfully, or handles errors otherwise.
     */
    const handleCreateBotGame = useCallback(async (): Promise<void> => {
        setErrorCreateGame(null);
        setSuccessCreateGame(null);
        setLoadingCreateGame(true);

        try {
            if (!socketRef.current || !playerStatic || !playerDynamic) throw new Error("No game created.");
            
            const playerA: InGamePlayer = {
                userId: playerStatic.userId,
                playerId: playerStatic.playerId,
                username: playerStatic.username,
                elo: playerDynamic.elo,
                connected: "pending",
                orientation: orientation,
            };

            const playerB: InGamePlayer = {
                userId: "botUserId",
                playerId: "botPlayerId",
                username: "BOT",
                elo: 1200,
                connected: "pending",
                orientation: orientation === "w"? "b" : "w",
            };

            const newGame = await sendCreateBotGame({playerA: playerA, playerB: playerB, difficulty, help});
            if (!newGame) throw new Error("No game created.");
            setBotGame(newGame.botGame);
            setSuccessCreateGame(`Game created successfully against ${difficulty} BOT!`);
        } catch (error) {
            setErrorCreateGame("Unable to create game. Please try again.");
        } finally {
            setLoadingCreateGame(false);
        }
    }, [setErrorCreateGame, setSuccessCreateGame, setLoadingCreateGame, socketRef, playerStatic, playerDynamic, orientation, sendCreateBotGame, difficulty, help, setBotGame]);
    
    /**
     * Handles forfeiting the current bot chess game. Updates the server and resets the local game state.
     *
     * @async
     * @returns {Promise<void>} - Resolves when the game is forfeited successfully, or handles errors otherwise.
     */
    const handleForfeit = useCallback(async (): Promise<void> => {
        setLoadingForfeit(true);
        setErrorForfeit(null);
        try {
            if(!botGame){
                throw new Error("Active game with winner required");
            }

            const updatedGame: BotGame = { ...botGame, winner: "playerB" };
            
            await sendCloseBotGame({ botGame: updatedGame});
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  currentBotGameId: undefined,
                };
            });
            cleanup();
        } catch (error) {
            setErrorForfeit("Unable to forfeit. Please try again.");
        } finally {
            setForfeitBotGame(false);
            setLoadingForfeit(false);
        }
    }, [setLoadingForfeit, setErrorForfeit, botGame, sendCloseBotGame, setPlayerDynamic, cleanup, setForfeitBotGame]);
    
    /**
     * Closes the current bot chess game. Determines the winner, updates the server, and resets the local game state.
     *
     * @async
     * @returns {Promise<void>} - Resolves when the game is closed successfully, or handles errors otherwise.
     */
    const handleCloseBotGame = useCallback(async ():Promise<void> => {
        setErrorOver(null);
        setLoadingOver(true);

        const winner = findWinner();
        
        try {
            if(!botGame || !winner){
                throw new Error("Active game with winner required");
            }

            const updatedGame: BotGame = { ...botGame, winner };
            
            await sendCloseBotGame({ botGame: updatedGame});
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  currentBotGameId: undefined,
                };
            });
            cleanup();

        } catch (error) {
            setErrorOver("Unable to close game. Please try again.");
        } finally {
            setLoadingOver(false);
        }
    }, [setErrorOver, setLoadingOver, findWinner, botGame, sendCloseBotGame, setPlayerDynamic, cleanup]);
    
    /*
    const handleReconnectRoom = useCallback(async () => {
        if (!game && playerDynamic?.currentGameId && playerStatic?.userId) {
            setErrorReconnectGame(null);
            setLoadingReconnectGame(true);
            
            try {
                const reconnectedGame = await sendReconnectRoom({ gameId: playerDynamic.currentGameId });
                
                if (!reconnectedGame?.game) throw new Error("No game to reconnect to.");
                    
                const isPlayerA = playerStatic.userId === reconnectedGame.game.playerA.userId;

                setOrientation(isPlayerA? reconnectedGame.game.playerA.orientation : reconnectedGame.game.playerB.orientation);

                setOpponent(isPlayerA? {
                    opponentUsername: reconnectedGame.game.playerB.username,
                    opponentUserId: reconnectedGame.game.playerB.userId,
                    opponentPlayerId: reconnectedGame.game.playerB.playerId,
                    opponentElo: reconnectedGame.game.playerB.elo,
                    opponentInviteId: reconnectedGame.game.playerB.inviteId || undefined
                } : {
                    opponentUsername: reconnectedGame.game.playerA.username,
                    opponentUserId: reconnectedGame.game.playerA.userId,
                    opponentPlayerId: reconnectedGame.game.playerA.playerId,
                    opponentElo: reconnectedGame.game.playerA.elo
                });
                
                setFen(reconnectedGame.game.fen);
                
                const deserializedHistory: Move[] = reconnectedGame.game.history?.map((moveString: string) => {
                    try {
                        return JSON.parse(moveString);
                    } catch (error) {
                        throw new Error("Unable to parse move");
                    }
                }).filter((move) => move !== null);

                setPlayerTurn(reconnectedGame.game.currentTurn);
                setHistory(deserializedHistory || []);
                setGame(reconnectedGame.game);
                setReconnectGame(true);
                navigate('/dashboard', { replace: true });
            } catch (error) {
                setOpponent(null);
                setFen("start");
                setErrorReconnectGame("Failed to reconnect to the active game. Please try again.")
            } finally {
                setLoadingReconnectGame(false);
            }
        }
    }, [game, playerDynamic, playerStatic, setErrorReconnectGame, setLoadingReconnectGame, setReconnectGame, sendReconnectRoom, setOrientation, setOpponent, setFen, setPlayerTurn, setHistory, setGame, navigate]);
    */
    return {
        handleCreateBotGame,
        handleCloseBotGame,
        handleForfeit,
    };
};