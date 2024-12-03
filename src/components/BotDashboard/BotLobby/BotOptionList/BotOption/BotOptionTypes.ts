/**
 * Represents the properties for the `BotOption` component.
 *
 * The `BotOptionProps` interface defines the structure of the props used by the `BotOption` component,
 * which displays a single bot difficulty option with an icon, label, and range, and handles selection behavior.
 *
 * @interface BotOptionProps
 * @property {string} icon - The source path for the icon representing the difficulty level.
 * @property {string} label - The display label for the difficulty level (e.g., "Novice", "Intermediate").
 * @property {string} range - The ELO range associated with the difficulty level (e.g., "< 1000", "1500-2000").
 * @property {boolean} isSelected - Indicates whether this option is currently selected.
 * @property {() => void} onClick - A callback function triggered when the option is clicked.
 */
export interface BotOptionProps {
    icon: string;
    label: string;
    range: string;
    isSelected: boolean;
    onClick: () => void;
}