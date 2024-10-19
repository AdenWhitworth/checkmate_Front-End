import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { AlertColor } from '@mui/material/Alert';

export default function MoveAlertBadge() {
    const { errorMove, setErrorMove } = useGame();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    const handleCloseBadge = () => {
        setErrorMove(null);
    }

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