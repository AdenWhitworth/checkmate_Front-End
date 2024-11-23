import { Square } from "chess.js";

/**
 * Represents the properties for an active chess game component.
 * 
 * @interface ActiveGameProps
 * @property {string} fen - The current board position in FEN (Forsyth–Edwards Notation) format,
 *                          representing the state of the chessboard.
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Callback function
 *                          triggered when a piece is dropped on the board. Returns `true` if the move
 *                          is valid, `false` otherwise.
 * @property {"w" | "b"} orientation - The orientation of the chessboard, indicating which side the
 *                          player is viewing from. `"w"` for white, `"b"` for black.
 */
export interface ActiveGameProps {
    fen: string;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    orientation: "w" | "b";
}