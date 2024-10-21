import React from 'react';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertBadgeProps } from './AlertBadgeTypes';

/**
 * AlertBadge component displays an alert message with a slide transition.
 * It adapts its position and dimensions based on the device screen size.
 *
 * @component
 * @param {object} props - Component props.
 * @param {string} [props.severity='info'] - Severity of the alert ('error', 'warning', 'info', 'success').
 * @param {string} props.text - The message to be displayed in the alert.
 * @param {function} props.onClose - Callback function to close the alert.
 * @param {boolean} props.open - Determines if the alert is open or closed.
 * @returns {JSX.Element} - The rendered AlertBadge component.
 */
export default function AlertBadge({
  severity = 'info',
  text,
  onClose,
  open
}: AlertBadgeProps) {

    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <Slide in={open} direction={isMobile ? "down" : "up"} timeout={500}>
            <Alert
                sx={{
                    position: "fixed",
                    marginLeft: isMobile ? "5vw" : "1vw",
                    boxSizing: 'border-box',
                    top: isMobile ? "2vw" : "unset",
                    bottom: isMobile ? "unset" : "1vw",
                    width: isMobile ? "90vw" : "98vw",
                    zIndex: 200,
                }}
                severity={severity}
                onClose={onClose}
            >
                {text}
            </Alert>
        </Slide>
    );
}

