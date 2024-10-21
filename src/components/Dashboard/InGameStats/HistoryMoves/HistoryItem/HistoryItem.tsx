import React from "react";
import { HistoryItemProps } from "./HistoryItemTypes";
import './HistoryItem.css';

/**
 * HistoryItem component displays a single row of chess moves in the history list.
 * It includes the move number, the move made by the white player, and the move made by the black player.
 * The row styling alternates based on whether the row is even or odd.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.rowMoves - An object containing the moves made by each player in the row.
 * @param {string} props.rowMoves.whiteMove - The move made by the white player.
 * @param {string} props.rowMoves.blackMove - The move made by the black player.
 * @param {number} props.index - The index of the row in the move history list.
 *
 * @returns {JSX.Element} The rendered HistoryItem component.
 */
export default function HistoryItem({rowMoves, index}: HistoryItemProps): JSX.Element {
    const rowNumber = index + 1;
    const rowClassName = `moves-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    return (
        <li>
            <div className={rowClassName}>
                <h3 className="move-number">{rowNumber}.</h3>
                <h3 className="move-white">{rowMoves.whiteMove}</h3>
                <h3 className="move-black">{rowMoves.blackMove}</h3>
            </div>
        </li>
    );
}