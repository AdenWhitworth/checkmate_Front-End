import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

/**
 * OpponentReconnectRoomBadge Component
 *
 * Displays an alert badge when the opponent successfully rejoins the game.
 *
 * @component
 * @returns {JSX.Element} The rendered ReconnectRoomBadge component.
 */
export default function OpponentReconnectRoomBadge(): JSX.Element {
    const { isOpponentDisconnected, setIsOpponentDisconnected } = useGame();
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets opponent disconnected state in the GameProvider.
     */
    const handleCloseBadge = () => {
        setIsOpponentDisconnected(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if(isOpponentDisconnected && isOpponentDisconnected.includes("reconnected")){
            setSeverity('success');
            setAlertText(isOpponentDisconnected);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [isOpponentDisconnected]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};