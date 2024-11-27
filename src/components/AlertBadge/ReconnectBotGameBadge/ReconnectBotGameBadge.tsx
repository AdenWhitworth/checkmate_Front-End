import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * ReconnectBotGameBadge component displays a success badge when the bot game is successfully reconnected.
 * It uses the `AlertBadge` component to show notifications with customizable severity and text.
 *
 * @component
 * @returns {JSX.Element} The rendered `ReconnectBotGameBadge` component.
 */
export default function ReconnectBotGameBadge(): JSX.Element {
    const { reconnectGame, setReconnectGame} = useBot();
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets reconnect game state in the BotProvider.
     */
    const handleCloseBadge = () => {
        setReconnectGame(false);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if(reconnectGame){
            setSeverity('success');
            setAlertText("Successfully reconnected to the active bot game.");
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [reconnectGame]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};