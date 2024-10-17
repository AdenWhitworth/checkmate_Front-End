import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

export default function CreateRoomAlertBadge() {
    const { errorCreateGame, successCreateGame, setErrorCreateGame, setSuccessCreateGame } = useGame();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    const handleCloseBadge = () => {
        setErrorCreateGame(null);
        setSuccessCreateGame(null);
    }

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
