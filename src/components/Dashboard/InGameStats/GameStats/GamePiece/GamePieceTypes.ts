import { PieceState } from '../../InGameStatsTypes';

/**
 * Interface representing the properties for the GamePiece component.
 * 
 * @interface GamePieceProps
 * 
 * @property {PieceState} piece - The state of the game piece, including its style and image details.
 * @property {string} username - The username of the player who owns this game piece.
 */
export interface GamePieceProps {
    piece: PieceState;
    username: string;
}