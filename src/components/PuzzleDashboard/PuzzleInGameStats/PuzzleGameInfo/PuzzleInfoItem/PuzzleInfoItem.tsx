import React from "react";
import './PuzzleInfoItem.css';
import { PuzzleInfoItemProps } from "./PuzzleInfoItemTypes";

/**
 * PuzzleInfoItem Component
 * 
 * Displays a single row of puzzle-related information, including a title and statistic.
 * Alternates row colors based on the index for visual distinction.
 * 
 * @component
 * @param {PuzzleInfoItemProps} props - Component properties.
 * @param {number} props.index - The index of the current item in the list. Used to determine row color.
 * @param {string} props.title - The title or label for the statistic.
 * @param {string} props.statistic - The value or data associated with the title.
 * 
 * @returns {JSX.Element} A list item representing a row of puzzle information.
 */
export default function PuzzleInfoItem({
    index,
    title,
    statistic,
}: PuzzleInfoItemProps): JSX.Element {
    const rowClassName = `puzzle-info-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    return (
        <li>
            <div className={rowClassName}>
                <div className="puzzle-info-line-container">
                    <h3 className="puzzle-info-title">{title}</h3>
                    <h3 className="puzzle-info-stat">{statistic}</h3>
                </div>
            </div>
        </li>
    );
}