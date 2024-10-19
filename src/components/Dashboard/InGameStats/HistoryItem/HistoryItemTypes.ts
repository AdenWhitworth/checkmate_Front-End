import { RowMoves } from "../InGameStatsTypes";

/**
 * Properties for the HistoryItem component which represents a single row of moves in the game history.
 * 
 * @interface HistoryItemProps
 * @property {RowMoves} rowMoves - An object representing the moves made by each player in a specific row.
 * @property {number} index - The index of the row in the move history list, used for alternating row styles and numbering.
 */
export interface HistoryItemProps {
    rowMoves: RowMoves;
    index: number;
}