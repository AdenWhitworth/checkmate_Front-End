import React from 'react';
import "./PuzzleOptionList.css";
import star from "../../../../Images/star yellow.svg";
import medal from "../../../../Images/medal yellow.svg";
import trophy from "../../../../Images/trophy yellow.svg";
import { OptionPuzzle } from './PuzzleOptionListTypes';
import { usePuzzle } from '../../../../Providers/PuzzleProvider/PuzzleProvider';
import PuzzleOption from './PuzzleOption/PuzzleOption';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';

/**
 * Renders a list of puzzle difficulty options for the player to select.
 * 
 * @component
 * @returns {JSX.Element} The PuzzleOptionList component.
 */
export default function PuzzleOptionList(): JSX.Element {
    const options: OptionPuzzle[] = [
        { icon: star, label: "Easy", range: "< 1200", value: "easy" },
        { icon: medal, label: "Medium", range: "1200-2000", value: "medium" },
        { icon: trophy, label: "Hard", range: "> 2000", value: "hard" },
    ];

    const {difficulty, setDifficulty} = usePuzzle();
    const { playerDynamic } = usePlayer();

    /**
     * Handles the click event to set the selected puzzle difficulty.
     * 
     * @param {"easy" | "medium" | "hard"} value - The selected difficulty level.
     */
    const handleOptionClick = (value: "easy" | "medium" | "hard") => {
        setDifficulty(value);
    }

    return (
        <div className="puzzle-options">
            {options.map((option, index) => (
                <PuzzleOption 
                    key={index} 
                    icon={option.icon} 
                    label={`${option.label} (${playerDynamic?.lastPuzzle[option.value]?? ""}/1000)`} 
                    range={option.range}
                    onClick={() => handleOptionClick(option.value)}
                    isSelected={difficulty === option.value} 
                />
            ))}
        </div>
    );
}