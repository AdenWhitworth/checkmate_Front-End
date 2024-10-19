import { PieceType, PieceState } from '../../InGameStatsTypes';

export interface GamePieceProps {
    key: PieceType;
    piece: PieceState;
    username: string;
}