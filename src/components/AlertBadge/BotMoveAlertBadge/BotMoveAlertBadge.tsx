import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * BotMoveAlertBadge Component
 *
 * Displays an alert badge when there is an error message related to moving a chess piece during a game.
 * Uses the `useBot` provider to obtain the error state related to move.
 *
 * @component
 * @returns {JSX.Element} The rendered BotMoveAlertBadge component.
 */
export default function BotMoveAlertBadge(): JSX.Element {
    const { errorMove, setErrorMove } = useBot();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the BotProvider.
     */
    const handleCloseBadge = () => {
        setErrorMove(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorMove) {
            setSeverity('error');
            setAlertText(errorMove);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorMove]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};