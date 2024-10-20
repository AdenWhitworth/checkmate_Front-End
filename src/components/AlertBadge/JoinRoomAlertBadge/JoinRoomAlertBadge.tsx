import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

/**
 * JoinRoomAlertBadge Component
 *
 * Displays an alert badge when there is an error or success message related to joining a game room.
 * Uses the `useGame` provider to obtain the error and success state related to joining an opponents room.
 *
 * @component
 * @returns {JSX.Element} The rendered JoinRoomAlertBadge component.
 */
export default function JoinRoomAlertBadge(): JSX.Element {
    const { errorJoinGame, successJoinGame, setErrorJoinGame, setSuccessJoinGame } = useGame();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the GameProvider.
     */
    const handleCloseBadge = () => {
        setErrorJoinGame(null);
        setSuccessJoinGame(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorJoinGame) {
            setSeverity('error');
            setAlertText(errorJoinGame);
            setOpen(true);
        } else if (successJoinGame) {
            setSeverity('success');
            setAlertText(successJoinGame);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorJoinGame, successJoinGame]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};