import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * CreateBotGameAlertBadge Component
 *
 * Displays an alert badge when there is an error or success message related to creating a game against a bot.
 * Uses the `useGame` provider to obtain the error and success state related to room creation.
 *
 * @component
 * @returns {JSX.Element} The rendered CreateBotGameAlertBadge component.
 */
export default function CreateBotGameAlertBadge(): JSX.Element {
    const { errorCreateGame, successCreateGame, setErrorCreateGame, setSuccessCreateGame } = useBot();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the GameProvider.
     */
    const handleCloseBadge = () => {
        setErrorCreateGame(null);
        setSuccessCreateGame(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorCreateGame) {
            setSeverity('error');
            setAlertText(errorCreateGame);
            setOpen(true);
        } else if (successCreateGame) {
            setSeverity('success');
            setAlertText(successCreateGame);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorCreateGame, successCreateGame]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};
