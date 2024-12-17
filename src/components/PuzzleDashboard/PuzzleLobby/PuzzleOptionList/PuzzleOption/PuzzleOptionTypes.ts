/**
 * Represents the properties for the PuzzleOption component.
 *
 * @interface PuzzleOptionProps
 * @property {string} icon - The path or URL of the icon image representing the puzzle difficulty.
 * @property {string} label - The label text for the puzzle difficulty (e.g., "Easy", "Medium", "Hard").
 * @property {string} range - The Elo rating range associated with the puzzle difficulty.
 * @property {boolean} isSelected - Indicates whether the puzzle option is currently selected.
 * @property {() => void} onClick - A callback function triggered when the option is clicked.
 */
export interface PuzzleOptionProps {
    icon: string;
    label: string;
    range: string;
    isSelected: boolean;
    onClick: () => void;
}