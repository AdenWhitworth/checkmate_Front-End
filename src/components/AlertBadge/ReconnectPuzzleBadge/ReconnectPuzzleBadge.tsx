import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';

/**
 * ReconnectPuzzleBadge component displays a success badge when the puzzle game is successfully reconnected.
 * It uses the `AlertBadge` component to show notifications with customizable severity and text.
 *
 * @component
 * @returns {JSX.Element} The rendered `ReconnectPuzzleBadge` component.
 */
export default function ReconnectPuzzleBadge(): JSX.Element {
    const { reconnectPuzzle, setReconnectPuzzle, difficulty, puzzle} = usePuzzle();

    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets reconnect game state in the PuzzleProvider.
     */
    const handleCloseBadge = () => {
        setReconnectPuzzle(false);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if(reconnectPuzzle){
            setSeverity('success');
            setAlertText(`Successfully reconnected to the active ${difficulty} puzzle #${puzzle?.puzzleTag}.`);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [difficulty, puzzle, reconnectPuzzle]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};