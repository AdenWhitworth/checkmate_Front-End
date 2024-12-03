import React from 'react';
import "./BotHelp.css";
import flameYellow from "../../../../../Images/flame yellow.svg";
import flameGrey from "../../../../../Images/flame grey.svg";
import { useBot } from '../../../../../Providers/BotProvider/BotProvider';

/**
 * A React functional component that provides options for selecting the level of help in the bot lobby.
 *
 * The `BotHelp` component visually displays the help levels (Assisted, Friendly, Challenge) using flames,
 * and allows the user to select the desired help level by clicking on the flames. The selected help level
 * is updated in the global bot context (`useBot`).
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the bot help settings.
 */
export default function BotHelp(): JSX.Element {
    const { help, setHelp } = useBot();
    const helpDescriptions = {
        assisted: "Full help",
        friendly: "Hints & Takebacks",
        challenge: "No help"
    }

    /**
     * Determines the flame configuration based on the `help` state.
     * @param {string} help - Current help level ("assisted", "friendly", "challenge").
     * @returns {string[]} - Array of flame image sources.
     */
    const getFlames = (help: "assisted" | "friendly" | "challenge"): string[] => {
        switch (help) {
            case "assisted":
                return [flameYellow, flameGrey, flameGrey];
            case "friendly":
                return [flameYellow, flameYellow, flameGrey];
            case "challenge":
                return [flameYellow, flameYellow, flameYellow];
            default:
                return [flameYellow, flameYellow, flameGrey];
        }
    };

    const flames = getFlames(help);

    /**
     * Handles the click event for flames and updates the help state.
     * @param {number} index - The index of the flame clicked (0 = assisted, 1 = friendly, 2 = challenge).
     */
    const handleFlameClick = (index: number) => {
        if (index === 0) setHelp("assisted");
        else if (index === 1) setHelp("friendly");
        else if (index === 2) setHelp("challenge");
    };

    return (
        <div className="bot-help">
            <div className="bot-help-selection">
                <div className="bot-help-flames">
                    {flames.map((flame, index) => (
                        <div
                            className="bot-help-flame"
                            key={index}
                            onClick={() => handleFlameClick(index)}
                        >
                            <img src={flame} alt={`Flame ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <h3>{help.charAt(0).toUpperCase() + help.slice(1)}</h3>
            </div>
            <h3 className='help-description'>{helpDescriptions[help]}</h3>
        </div>
    );
}