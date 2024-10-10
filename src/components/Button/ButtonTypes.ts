import { ReactNode, MouseEventHandler } from 'react';

export interface ButtonProps {
    children: ReactNode;
    styleType: 'primary' | 'secondary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    testId?: string;
}