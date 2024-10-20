import { PieceType, CapturedPiece, PieceState, PieceImages } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

/**
 * Interface representing the properties and functions returned by the useCapturedPieces hook.
 *
 * @interface UseCapturedPiecesOutput
 * @property {function} updateCapturedPieces - Function to update the state of captured pieces for both the player and the opponent.
 * @property {CapturedPiece[]} capturedPieces - Array containing the captured pieces for each player.
 * @property {Record<PieceType, PieceState>} playerPieces - Object representing the current state of captured pieces for the player, including image and style.
 * @property {Record<PieceType, PieceState>} opponentPieces - Object representing the current state of captured pieces for the opponent, including image and style.
 * @property {function} checkCaptured - Function to check if a piece was captured and update the captured pieces state accordingly.
 */
export interface UseCapturedPiecesOutput {
    updateCapturedPieces: () => void;
    capturedPieces: CapturedPiece[];
    playerPieces: Record<PieceType, PieceState>;
    opponentPieces: Record<PieceType, PieceState>;
    checkCaptured: () => void;
}