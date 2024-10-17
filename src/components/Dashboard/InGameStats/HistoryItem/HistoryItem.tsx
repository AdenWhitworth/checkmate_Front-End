import React from "react";
import { HistoryItemProps } from "./HistoryItemTypes";
import './HistoryItem.css';

export default function HistoryItem({rowMoves, index}: HistoryItemProps) {
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