import React from 'react';
import "./BotOption.css";
import { BotOptionProps } from './BotOptionTypes';

/**
 * A React functional component representing a single bot difficulty option.
 *
 * The `BotOption` component displays an icon, a label, and a range for a specific bot difficulty level.
 * It also handles user interactions by invoking the `onClick` callback when selected.
 * The `isSelected` prop determines if the option is highlighted as the currently selected option.
 *
 * @component
 * @param {BotOptionProps} props - The props for the `BotOption` component.
 * @param {string} props.icon - The source path for the icon representing the difficulty level.
 * @param {string} props.label - The display label for the difficulty level.
 * @param {string} props.range - The ELO range associated with the difficulty level.
 * @param {boolean} props.isSelected - Indicates if the option is currently selected.
 * @param {() => void} props.onClick - The callback function invoked when the option is clicked.
 *
 * @returns {JSX.Element} A JSX element representing a bot difficulty option.
 */
export default function BotOption({ icon, label, range, isSelected, onClick }: BotOptionProps): JSX.Element {
    return (
        <div 
            onClick={onClick} 
            className={`bot-option ${isSelected? "option-selected" : ""}`}
            data-testid="bot-option"
        >
            <div className="bot-option-container">
                <div className="bot-option-difficulty">
                    <div className="bot-option-icon">
                        <img src={icon} alt={`${label} Icon`} />
                    </div>
                    <h3 className="bot-option-difficulty-txt">{label}</h3>
                </div>
                <h3 className="bot-option-range">{range}</h3>
            </div>
        </div>
    );
}
