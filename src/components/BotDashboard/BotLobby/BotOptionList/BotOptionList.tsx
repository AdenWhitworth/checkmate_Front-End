import React from 'react';
import "./BotOptionList.css";
import BotOption from './BotOption/BotOption';
import star from "../../../../Images/star yellow.svg";
import medal from "../../../../Images/medal yellow.svg";
import trophy from "../../../../Images/trophy yellow.svg";
import crown from "../../../../Images/crown yellow.svg";
import { useBot } from '../../../../Providers/BotProvider/BotProvider';
import { OptionBot } from './BotOptionListTypes';

/**
 * A React functional component that renders a list of bot difficulty options for selection.
 * 
 * The `BotOptionList` component maps through a predefined array of difficulty options and displays
 * each option as a `BotOption` component. Clicking on an option updates the selected difficulty in the `useBot` context.
 * 
 * @component
 * @returns {JSX.Element} The JSX representation of the bot options list.
 */
export default function BotOptionList(): JSX.Element {
    const options: OptionBot[] = [
        { icon: star, label: "Novice", range: "< 1000", value: "novice" },
        { icon: medal, label: "Intermediate", range: "1000-1500", value: "intermediate" },
        { icon: trophy, label: "Advanced", range: "1500-2000", value: "advanced" },
        { icon: crown, label: "Master", range: "> 2000", value: "master" },
    ];

    const { difficulty, setDifficulty } = useBot();

    /**
     * Handles click events for selecting a difficulty level.
     * 
     * @param {"novice" | "intermediate" | "advanced" | "master"} value - The selected difficulty level.
     */
    const handleOptionClick = (value: "novice" | "intermediate" | "advanced" | "master") => {
        setDifficulty(value);
    }

    return (
        <div className="bot-options">
            {options.map((option, index) => (
                <BotOption 
                    key={index} 
                    icon={option.icon} 
                    label={option.label} 
                    range={option.range}
                    onClick={() => handleOptionClick(option.value)}
                    isSelected={difficulty === option.value} 
                />
            ))}
        </div>
    );
}
