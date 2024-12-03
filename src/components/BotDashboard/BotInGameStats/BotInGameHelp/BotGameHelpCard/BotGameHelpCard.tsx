import React from 'react';
import { BotInGameHelpCardProps } from './BotGameHelpCardTypes';
import "./BotGameHelpCard.css";
import LoadingDots from '../../../../LoadingDots/LoadingDots';

/**
 * Renders an in-game help card for bot chess games. Displays an icon, a label, and a tally of remaining actions.
 *
 * @component
 * @param {BotInGameHelpCardProps} props - The properties required for the BotInGameHelpCard component.
 * @param {string} props.imgSrc - The source URL for the card's icon image.
 * @param {string} props.imgAlt - The alternative text for the icon image.
 * @param {string} props.label - The label displayed below the icon.
 * @param {number | undefined} props.tallyCount - The number of remaining actions to display as tally dots (0 to 3). If undefined, no tally is shown.
 * @param {() => void} props.onClick - The function to handle card click events.
 * @param {boolean} props.disable - Whether the card is disabled (non-interactive).
 * @param {boolean} props.loading - Whether the card is loading or active.
 * @returns {JSX.Element} - The rendered BotInGameHelpCard component.
 */
export default function BotInGameHelpCard({
    imgSrc,
    imgAlt,
    label,
    tallyCount,
    onClick,
    disable,
    loading,
}: BotInGameHelpCardProps): JSX.Element {
    /**
     * Renders the tally dots based on the `tallyCount` value.
     *
     * @returns {JSX.Element | null} - The JSX element representing the tally dots, or null if no tally should be displayed.
     */
    const renderTally = () => {
        if (tallyCount === undefined || tallyCount > 3) return null;

        const tallyDots = Array(3).fill("inactive-tally");
        for (let i = 2; i >= 3 - tallyCount; i--) {
            tallyDots[i] = "active-tally";
        }

        return (
            <div className="ingame-help-tally">
                {tallyDots.map((tally, index) => (
                    <div
                        key={index}
                        className={`tally-dot ${tally}`}
                    ></div>
                ))}
            </div>
        );
    };

    return (
        <div onClick={onClick} className={`ingame-help-card ${disable? "card-disable" : "card-active"}`}>
            {loading? (
                <LoadingDots position='center' size='small' color='grey' />
            ):(
                <>
                    <div className="ingame-help-icon">
                        <img src={imgSrc} alt={imgAlt} />
                    </div>
                    <h5>{label}</h5>
                    {renderTally()}
                </>
            )}
        </div>
    );
}
