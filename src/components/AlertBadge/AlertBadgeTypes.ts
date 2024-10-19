import { AlertColor } from '@mui/material/Alert';

/**
 * Props for the AlertBadge component.
 *
 * @interface AlertBadgeProps
 * @property {AlertColor} severity - The severity level of the alert. It defines the color and importance of the alert ('error', 'warning', 'info', 'success').
 * @property {string} text - The message text to be displayed inside the alert.
 * @property {() => void} [onClose] - Optional callback function to be called when the alert is closed.
 * @property {boolean} open - Determines whether the alert should be open or closed.
 */
export interface AlertBadgeProps {
    severity: AlertColor;
    text: string;
    onClose?: () => void;
    open: boolean;
}
