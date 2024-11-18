import React from "react";
import { HistoryItemProps } from "./HistoryItemTypes";
import './HistoryItem.css';
import pawn_white from "../../../../../Images/Pawn White.svg";
import bishop_white from "../../../../../Images/Bishop White.svg";
import castle_white from "../../../../../Images/Castle White.svg";
import knight_white from "../../../../../Images/Knight White.svg";
import queen_white from "../../../../../Images/Queen White.svg";
import king_white from "../../../../../Images/King White.svg";
import pawn_black from "../../../../../Images/Pawn Black.svg";
import bishop_black from "../../../../../Images/Bishop Black.svg";
import castle_black from "../../../../../Images/Castle Black.svg";
import knight_black from "../../../../../Images/Knight Black.svg";
import queen_black from "../../../../../Images/Queen Black.svg";
import king_black from "../../../../../Images/King Black.svg";

const pieceImages = {
    whitePieces: {
        p: pawn_white,
        n: knight_white,
        b: bishop_white,
        r: castle_white,
        q: queen_white,
        k: king_white,
    },
    blackPieces: {
        p: pawn_black,
        n: knight_black,
        b: bishop_black,
        r: castle_black,
        q: queen_black,
        k: king_black,
    }
};

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
                <div className="move-white">
                    <img src={pieceImages.whitePieces[rowMoves.whitePiece]} alt={`White ${rowMoves.whitePiece} to ${rowMoves.whiteMove}`}></img>
                    <h3>{rowMoves.whiteMove}</h3>
                </div>
                <div className="move-black">
                    <img className={rowMoves.blackPiece? undefined : "hidden"} src={rowMoves.blackPiece? pieceImages.blackPieces[rowMoves.blackPiece] : pieceImages.blackPieces["p"]} alt={`Black ${rowMoves.blackPiece} to ${rowMoves.blackMove}`}></img>
                    <h3>{rowMoves.blackMove}</h3>
                </div>
            </div>
        </li>
    );
}