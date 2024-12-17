import { CapturedPiece, PieceState, PieceType } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

/**
 * Props for the `useCapturedPuzzlePieces` hook.
 *
 * @interface UseCapturedPuzzlePiecesProps
 * @property {"w" | "b"} orientation - The player's orientation in the game ("w" for white, "b" for black).
 * @property {string} fen - The current FEN (Forsyth-Edwards Notation) string representing the board state.
 */
export interface UseCapturedPuzzlePiecesProps {
    orientation: "w" | "b";
    fen: string;
}

/**
 * Output returned by the `useCapturedPuzzlePieces` hook.
 *
 * @interface UseCapturedPuzzlePiecesOutput
 * @property {CapturedPiece[]} capturedPieces - An array of captured pieces for both players, including piece counts.
 * @property {Record<PieceType, PieceState>} playerPieces - A record of the player's captured pieces, with their states and associated styles or images.
 * @property {Record<PieceType, PieceState>} opponentPieces - A record of the opponent's captured pieces, with their states and associated styles or images.
 * @property {() => void} calculateCapturedPieces - A function to recalculate captured pieces based on the current FEN string.
 */
export interface UseCapturedPuzzlePiecesOutput {
    capturedPieces: CapturedPiece[];
    playerPieces: Record<PieceType, PieceState>;
    opponentPieces: Record<PieceType, PieceState>;
    calculateCapturedPieces: () => void;
}