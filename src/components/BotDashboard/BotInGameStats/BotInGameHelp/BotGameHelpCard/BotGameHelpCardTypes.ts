/**
 * Interface defining the properties passed to the `BotInGameHelpCard` component.
 *
 * @interface BotInGameHelpCardProps
 * @property {string} imgSrc - The source URL of the image displayed in the card.
 * @property {string} imgAlt - The alt text for the image, providing a textual description.
 * @property {string} label - The label displayed on the card, typically describing the action or purpose.
 * @property {number} [tallyCount] - Optional count displayed on the card, representing a tally or remaining attempts.
 * @property {() => void} onClick - The function to call when the card is clicked.
 * @property {boolean} disable - Flag indicating whether the card is disabled and unclickable.
 * @property {boolean} [loading] - Optional flag indicating whether the card is in a loading state.
 */
export interface BotInGameHelpCardProps {
    imgSrc: string;
    imgAlt: string;
    label: string;
    tallyCount?: number;
    onClick: () => void;
    disable: boolean;
    loading?: boolean;
}