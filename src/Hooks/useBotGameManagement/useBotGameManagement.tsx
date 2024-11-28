import { useCallback } from 'react';
import { InGamePlayer } from '../../Providers/GameProvider/GameProviderTypes';
import { UseBotGameManagementOutput, UseBotGameManagementProps } from './useBotGameManagementTypes';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { BotGame } from '../../Providers/BotProvider/BotProviderTypes';
import { Move } from 'chess.js';

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
    findWinner,
    setReconnectGame,
    setLoadingReconnectGame,
    setErrorReconnectGame,
    setRemainingUndos,
    setRemainingHints,
    setHelp,
    setDifficulty
}: UseBotGameManagementProps): UseBotGameManagementOutput => {
    
    const { 
        socketRef, 
        sendCreateBotGame,
        sendCloseBotGame,
        sendReconnectBotGame
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
            setRemainingHints(newGame.botGame.remainingHints);
            setRemainingUndos(newGame.botGame.remainingUndos);
            setSuccessCreateGame(`Game created successfully against ${difficulty} BOT!`);
        } catch (error) {
            setErrorCreateGame("Unable to create game. Please try again.");
        } finally {
            setLoadingCreateGame(false);
        }
    }, [setErrorCreateGame, setSuccessCreateGame, setLoadingCreateGame, socketRef, playerStatic, playerDynamic, orientation, sendCreateBotGame, difficulty, help, setBotGame, setRemainingHints, setRemainingUndos]);
    
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
    
    /**
     * Handles reconnecting to an active bot game.
     *
     * This function attempts to re-establish a connection to an ongoing bot game
     * using the player's current game ID. It fetches the game's data, updates
     * the game state, and restores the board, history, and player settings.
     * 
     * @returns {Promise<void>} - A promise that resolves when the reconnection process is complete.
     * 
     * @throws {Error} If the game cannot be reconnected due to invalid data or missing game details.
     */
    const handleReconnectBotGame = useCallback(async (): Promise<void> => {
        if (!botGame && playerDynamic?.currentBotGameId && playerStatic?.userId) {
            setErrorReconnectGame(null);
            setLoadingReconnectGame(true);
            
            try {
                const reconnectedGame = await sendReconnectBotGame({ gameId: playerDynamic.currentBotGameId });
                
                if (!reconnectedGame?.botGame) throw new Error("No game to reconnect to.");

                setOrientation(reconnectedGame.botGame.playerA.orientation);
                
                setFen(reconnectedGame.botGame.fen);
                
                const deserializedHistory: Move[] = reconnectedGame.botGame.history?.map((moveString: string) => {
                    try {
                        return JSON.parse(moveString);
                    } catch (error) {
                        throw new Error("Unable to parse move");
                    }
                }).filter((move) => move !== null);
                setPlayerTurn(reconnectedGame.botGame.currentTurn);
                setHistory(deserializedHistory || []);
                setRemainingHints(reconnectedGame.botGame.remainingHints);
                setRemainingUndos(reconnectedGame.botGame.remainingUndos);
                setHelp(reconnectedGame.botGame.help);
                setDifficulty(reconnectedGame.botGame.difficulty);
                setBotGame(reconnectedGame.botGame);
                setReconnectGame(true);
            } catch (error) {
                setFen("start");
                setErrorReconnectGame("Failed to reconnect to the active game. Please try again.")
            } finally {
                setLoadingReconnectGame(false);
            }
        }
    }, [botGame, playerDynamic, playerStatic, setErrorReconnectGame, setLoadingReconnectGame, sendReconnectBotGame, setOrientation, setFen, setPlayerTurn, setHistory, setRemainingHints, setRemainingUndos, setHelp, setDifficulty, setBotGame, setReconnectGame]);
    
    return {
        handleCreateBotGame,
        handleCloseBotGame,
        handleForfeit,
        handleReconnectBotGame
    };
};