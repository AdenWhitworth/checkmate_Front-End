import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * BotUndoAlertBadge component displays an alert badge for errors related to undo actions in a bot game.
 * It listens for changes in the undo error state from the BotProvider and dynamically updates the alert.
 *
 * @component
 * @returns {JSX.Element} The rendered BotUndoAlertBadge component.
 */
export default function BotUndoAlertBadge(): JSX.Element {
    const { errorUndo, setErrorUndo } = useBot();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the BotProvider.
     */
    const handleCloseBadge = () => {
        setErrorUndo(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorUndo) {
            setSeverity('error');
            setAlertText(errorUndo);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorUndo]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};