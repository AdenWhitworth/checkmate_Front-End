import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

/**
 * ReconnectRoomBadge Component
 *
 * Displays an alert badge when the player successfully rejoins the game.
 *
 * @component
 * @returns {JSX.Element} The rendered ReconnectRoomBadge component.
 */
export default function ReconnectRoomBadge(): JSX.Element {
    const { reconnectGame, setReconnectGame } = useGame();
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets reconnect game state in the GameProvider.
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
            setAlertText("Successfully reconnected to the active game.");
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