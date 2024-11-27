import { Square } from "chess.js";

/**
 * Represents the properties for an active chess game component.
 *
 * @interface ActiveGameProps
 * @property {string} fen - The current board position in FEN (Forsyth–Edwards Notation) format,
 *                          representing the state of the chessboard.
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Callback function
 *                          triggered when a piece is dropped on the board. Receives the source and 
 *                          target squares as arguments. Returns `true` if the move is valid, `false` otherwise.
 * @property {"w" | "b"} orientation - The orientation of the chessboard, indicating which side the
 *                          player is viewing from. `"w"` for white, `"b"` for black.
 * @property {[Square, Square] | null} [hint] - An optional hint represented as a tuple of the start 
 *                          and end squares. If provided, an arrow is displayed on the board to indicate
 *                          the suggested move. Defaults to `null` if no hint is available.
 */
export interface ActiveGameProps {
    fen: string;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    orientation: "w" | "b";
    hint?: [Square, Square] | null;
}