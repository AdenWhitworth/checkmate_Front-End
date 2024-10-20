import { ReactNode, MouseEventHandler } from 'react';

/**
 * Properties for the Button component.
 * 
 * @interface ButtonProps
 * 
 * @property {ReactNode} children - The content to be displayed inside the button, such as text or icons.
 * @property {'primary' | 'secondary'} styleType - The visual style of the button, determining its appearance.
 * @property {MouseEventHandler<HTMLButtonElement>} [onClick] - An optional function to handle button click events.
 * @property {'button' | 'submit' | 'reset'} [type='button'] - The HTML button type attribute.
 * @property {string} [className] - Additional CSS class names to apply to the button.
 * @property {boolean} [disabled=false] - If true, the button will be disabled.
 * @property {string} [testId] - An optional data-testid for testing purposes.
 * @property {string} [imgSrc] - An optional source URL for an icon image.
 * @property {string} [imgAlt=''] - The alternative text for the button icon.
 * @property {string} [id] - Optional id attribute for the button element.
 * @property {string} [name] - Optional name attribute for the button element.
 */
export interface ButtonProps {
    children: ReactNode;
    styleType: 'primary' | 'secondary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    testId?: string;
    imgSrc?: string;
    imgAlt?: string; 
    id?: string;
    name?: string;
}