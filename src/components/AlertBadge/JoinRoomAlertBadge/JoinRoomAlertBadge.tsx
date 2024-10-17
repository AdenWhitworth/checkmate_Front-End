import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

export default function JoinRoomAlertBadge() {
    const { errorJoinGame, successJoinGame, setErrorJoinGame, setSuccessJoinGame } = useGame();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    const handleCloseBadge = () => {
        setErrorJoinGame(null);
        setSuccessJoinGame(null);
    }

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