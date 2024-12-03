import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * BotHintAlertBadge component displays an alert badge for errors related to hints in a bot game.
 * It listens for changes in the error state from the BotProvider and dynamically updates the alert.
 *
 * @component
 * @returns {JSX.Element} The rendered BotHintAlertBadge component.
 */
export default function BotHintAlertBadge(): JSX.Element {
    const { errorHint, setErrorHint } = useBot();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the BotProvider.
     */
    const handleCloseBadge = () => {
        setErrorHint(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorHint) {
            setSeverity('error');
            setAlertText(errorHint);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorHint]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};