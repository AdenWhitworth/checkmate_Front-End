import { AlertColor } from '@mui/material/Alert';

export interface AlertBadgeProps {
    severity: AlertColor;
    text: string;
    onClose?: () => void;
    open: boolean;
}
