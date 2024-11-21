import { MouseEventHandler } from 'react';

/**
 * Properties for the Profile Circle component.
 * 
 * @interface ProfileCircleProps
 * 
 * @property {MouseEventHandler<HTMLButtonElement>} [onClick] - An optional function to handle button click events.
 */
export interface ProfileCircleProps {
    onClick: MouseEventHandler<HTMLDivElement>;
}