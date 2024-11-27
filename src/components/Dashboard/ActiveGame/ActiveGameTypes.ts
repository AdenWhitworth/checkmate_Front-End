import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

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
 * @property {(square: Square) => void} [onSquareClick] - Optional callback function triggered when a square is clicked.
 *                          Receives the clicked square as an argument.
 * @property {Record<string, any>} [highlightedSquares] - An optional object defining custom styles for specific squares.
 *                          Keys are square coordinates (e.g., "e4"), and values are style objects.
 * @property {(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean} [onPromotionPieceSelect] - 
 *                          Optional callback function triggered during a pawn promotion. Receives the selected promotion piece,
 *                          the square from which the pawn was promoted, and the square to which it was promoted. 
 *                          Returns `true` if the promotion is valid, `false` otherwise.
 */
export interface ActiveGameProps {
    fen: string;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    orientation: "w" | "b";
    hint?: [Square, Square] | null;
    onSquareClick?: (square: Square) => void;
    highlightedSquares?: Record<string, any>;
    onPromotionPieceSelect?: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
}