/**
 * Properties for the MessageIcon component.
 *
 * @interface MessageIconProps
 * @property {number} messageBadge - The number of new messages to be displayed on the badge.
 * @property {string} messageStyle - The URL or source path of the image to be used as the message icon.
 * @property {() => void} showMessages - A callback function to handle showing or toggling the message view.
 */
export interface MessageIconProps {
    messageBadge: number;
    messageStyle: string;
    showMessages: () => void;
}