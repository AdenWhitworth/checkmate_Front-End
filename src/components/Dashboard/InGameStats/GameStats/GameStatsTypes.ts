import { PieceType, PieceState } from "../InGameStatsTypes";

export interface GameStatsProps {
    username: string;
    wins: number | string;
    losses: number | string;
    pieces: Record<PieceType, PieceState>;
    isTurn: boolean;
    isLoading: boolean;
}