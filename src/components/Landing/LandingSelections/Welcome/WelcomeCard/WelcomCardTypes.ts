/**
 * Represents the properties for the WelcomeCard component.
 *
 * @interface WelcomeCardProps
 * @property {string} imgSrc - The source path for the card's icon image.
 * @property {string} title - The title text displayed on the card.
 * @property {string} text - The descriptive text displayed on the card.
 * @property {() => void} onClick - The function to be executed when the card is clicked.
 */
export interface WelcomeCardProps{
    imgSrc: string;
    title: string;
    text: string;
    onClick: () => void;
}