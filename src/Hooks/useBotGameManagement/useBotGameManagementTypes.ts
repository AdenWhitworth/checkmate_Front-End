import { Move } from 'chess.js';
import { BotGame } from '../../Providers/BotProvider/BotProviderTypes';

/**
 * Interface defining the properties required by the `useBotGameManagement` hook.
 *
 * @interface UseBotGameManagementProps
 * @property {() => void} cleanup - Function to clean up the current game state, resetting related values.
 * @property {BotGame | null} botGame - The current bot game object, or null if no game is active.
 * @property {(botGame: BotGame | null) => void} setBotGame - Function to update the bot game state.
 * @property {(value: string) => void} setFen - Function to update the FEN (Forsyth-Edwards Notation) string representing the game state.
 * @property {(value: Move[]) => void} setHistory - Function to update the move history of the game.
 * @property {(orientation: "w" | "b") => void} setOrientation - Function to set the player's orientation ("w" for white, "b" for black).
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to update the current player's turn.
 * @property {(value: boolean) => void} setLoadingCreateGame - Function to set the loading state when creating a bot game.
 * @property {(value: string | null) => void} setSuccessCreateGame - Function to set a success message when a bot game is created successfully.
 * @property {(value: string | null) => void} setErrorCreateGame - Function to set an error message when creating a bot game fails.
 * @property {"w" | "b"} orientation - The player's orientation in the game ("w" for white, "b" for black).
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The difficulty level of the bot opponent.
 * @property {"assisted" | "friendly" | "challenge"} help - The help mode selected for the game (e.g., assisted for maximum help, challenge for no help).
 * @property {(value: boolean) => void} setLoadingOver - Function to set the loading state when closing a bot game.
 * @property {(value: string | null) => void} setErrorOver - Function to set an error message when closing a bot game fails.
 * @property {(value: boolean) => void} setLoadingForfeit - Function to set the loading state when forfeiting a game.
 * @property {(value: string | null) => void} setErrorForfeit - Function to set an error message when forfeiting a game fails.
 * @property {(value: boolean) => void} setForfeitBotGame - Function to update the state indicating whether a forfeit action is active.
 * @property {() => "playerA" | "playerB" | "draw" | null} findWinner - Function to determine the winner of the game.
 * @property {(value: boolean) => void} setReconnectGame - Function to update the state indicating whether the game should reconnect.
 * @property {(value: boolean) => void} setLoadingReconnectGame - Function to set the loading state when reconnecting to a game.
 * @property {(value: string | null) => void} setErrorReconnectGame - Function to set an error message when reconnecting to a game fails.
 */
export interface UseBotGameManagementProps {
    cleanup: () => void;
    botGame: BotGame | null;
    setBotGame: (botGame: BotGame | null) => void;
    setFen:(value: string) => void;
    setHistory: (value: Move[]) => void;
    setOrientation: (orientation: "w" | "b") => void;
    setPlayerTurn: (value: "w" | "b") => void;
    setLoadingCreateGame: (value: boolean) => void;
    setSuccessCreateGame: (value: string | null) => void;
    setErrorCreateGame: (value: string | null) => void;
    orientation: "w" | "b";
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    help: "assisted" | "friendly" | "challenge";
    setLoadingOver: (value: boolean) => void;
    setErrorOver: (value: string | null) => void;
    setLoadingForfeit: (value: boolean) => void;
    setErrorForfeit: (value: string | null) => void;
    setForfeitBotGame: (value: boolean) => void;
    findWinner: () => "playerA" | "playerB" | "draw" | null;
    setReconnectGame: (value: boolean) => void;
    setLoadingReconnectGame: (value: boolean) => void;
    setErrorReconnectGame: (value: string | null) => void;
}

/**
 * Interface defining the output of the `useBotGameManagement` hook.
 *
 * @interface UseBotGameManagementOutput
 * @property {() => Promise<void>} handleCreateBotGame - Function to create a new bot game. Sets up the game state and communicates with the server.
 * @property {() => Promise<void>} handleCloseBotGame - Function to close the current bot game. Determines the winner and updates the game state.
 * @property {() => Promise<void>} handleForfeit - Function to forfeit the current bot game. Updates the server and resets the game state locally.
 */
export interface UseBotGameManagementOutput {
    handleCreateBotGame: () => Promise<void>;
    handleCloseBotGame: () => Promise<void>
    handleForfeit: () => Promise<void>
}