import React from 'react';
import "./PuzzleOption.css";
import { PuzzleOptionProps } from './PuzzleOptionTypes';

/**
 * Renders a selectable puzzle difficulty option.
 *
 * @component
 * @param {PuzzleOptionProps} props - The props for the PuzzleOption component.
 * @param {string} props.icon - The path or URL of the icon image representing the puzzle difficulty.
 * @param {string} props.label - The label for the puzzle difficulty (e.g., "Easy", "Medium", "Hard").
 * @param {string} props.range - The Elo rating range associated with the difficulty.
 * @param {boolean} props.isSelected - Whether the option is currently selected.
 * @param {() => void} props.onClick - The callback function triggered when the option is clicked.
 * @returns {JSX.Element} A JSX element that renders a puzzle difficulty option.
 */
export default function PuzzleOption({ icon, label, range, isSelected, onClick }: PuzzleOptionProps): JSX.Element {
    return (
        <div onClick={onClick} className={`puzzle-option ${isSelected? "option-selected" : ""}`}>
            <div className="puzzle-option-container">
                <div className="puzzle-option-difficulty">
                    <div className="puzzle-option-icon">
                        <img src={icon} alt={`${label} Icon`} />
                    </div>
                    <h3 className="puzzle-option-difficulty-txt">{label}</h3>
                </div>
                <h3 className="puzzle-option-range">{range}</h3>
            </div>
        </div>
    );
}