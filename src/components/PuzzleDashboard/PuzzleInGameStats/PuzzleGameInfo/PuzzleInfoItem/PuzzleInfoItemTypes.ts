/**
 * Props for the PuzzleInfoItem component.
 * 
 * @interface PuzzleInfoItemProps
 * @property {number} index - The index of the current item in the list. Used to alternate row styling.
 * @property {string} title - The title or label to describe the statistic.
 * @property {string} statistic - The value or data associated with the title.
 */
export interface PuzzleInfoItemProps {
    index: number;
    title: string;
    statistic: string;
}