import { PieceType, PieceState } from "../InGameStatsTypes";

/**
 * Interface representing the props for the GameStats component.
 * It provides information about a player's game statistics and current state in an active game.
 *
 * @interface GameStatsProps
 * @property {string} username - The username of the player whose stats are being displayed.
 * @property {number | string} elo - The elo ranking of the player whose stats are being displayed.
 * @property {Record<PieceType, PieceState>} pieces - An object containing captured pieces, where each key is a piece type and each value represents the state of the piece.
 * @property {boolean} isTurn - A boolean indicating whether it is currently the player's turn.
 * @property {boolean} isLoading - A boolean indicating whether the captured pieces data is still loading.
 * @property {boolean} isBot - A boolean indicating whether the player whose stats are being displayed is a bot.
 */
export interface GameStatsProps {
    username: string;
    elo: number | string;
    pieces: Record<PieceType, PieceState>;
    isTurn: boolean;
    isLoading: boolean;
    isBot: boolean;
}