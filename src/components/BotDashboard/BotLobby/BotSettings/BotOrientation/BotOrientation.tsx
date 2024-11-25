import React, { useState } from 'react';
import "./BotOrientation.css";
import kingWhite from "../../../../../Images/King White.svg";
import kingBlack from "../../../../../Images/King Black.svg";
import question from "../../../../../Images/question grey.svg";
import { useBot } from '../../../../../Providers/BotProvider/BotProvider';

/**
 * A React functional component that provides options for selecting the player's orientation
 * in the bot game (White, Black, or Random).
 *
 * The `BotOrientation` component visually represents the three choices and updates the orientation
 * in the global bot context (`useBot`) when an option is selected. If the "Random" option is selected,
 * the orientation is determined randomly between White and Black.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the bot orientation selection options.
 */
export default function BotOrientation(): JSX.Element {
    const { setOrientation } = useBot();
    const [selectedOption, setSelectedOption] = useState<"w" | "b" | "random" >("w");

    /**
     * Handles selection of a specific orientation.
     * @param {string} option - Selected option ("w", "b", or "random").
     */
    const handleSelection = (option: "w" | "b" | "random") => {
        setSelectedOption(option);
        if (option === "random") {
            const randomOrientation = Math.random() < 0.5 ? "w" : "b";
            setOrientation(randomOrientation);
        } else {
            setOrientation(option);
        }
    };

    return (
        <div className="bot-orientation">
            <h3>Play as:</h3>

            <div
                className={`bot-orientation-option solid-color ${
                    selectedOption === "w" ? "orientation-selected" : ""
                }`}
                onClick={() => handleSelection("w")}
            >
                <div className="bot-orientation-option-img">
                    <img src={kingWhite} alt="White King" />
                </div>
            </div>

            <div
                className={`bot-orientation-option split-color ${
                    selectedOption === "random" ? "orientation-selected" : ""
                }`}
                onClick={() => handleSelection("random")}
            >
                <div className="bot-orientation-option-img">
                    <img src={question} alt="Question mark" />
                </div>
            </div>

            <div
                className={`bot-orientation-option solid-color ${
                    selectedOption === "b" ? "orientation-selected" : ""
                }`}
                onClick={() => handleSelection("b")}
            >
                <div className="bot-orientation-option-img">
                    <img src={kingBlack} alt="Black King" />
                </div>
            </div>
        </div>
    );
}


