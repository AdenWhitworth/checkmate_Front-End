import React, { useState, useEffect } from 'react';
import AlertBadge from '../AlertBadge';
import { AlertColor } from '@mui/material/Alert';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';

/**
 * CreatePuzzleAlertBadge Component
 *
 * This component displays an alert badge for puzzle creation success or error messages.
 * It listens to `errorStartPuzzle` and `successStartPuzzle` from the PuzzleProvider
 * and updates the badge with appropriate severity and message.
 *
 * @component
 * @returns {JSX.Element} A styled alert badge component that dynamically shows success or error messages.
 */
export default function CreatePuzzleAlertBadge(): JSX.Element {
    const { errorStartPuzzle, successStartPuzzle, setErrorStartPuzzle, setSuccessStartPuzzle } = usePuzzle();
    
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [alertText, setAlertText] = useState<string>('');

    /**
     * Closes the alert badge and resets error and success state in the PuzzleProvider.
     */
    const handleCloseBadge = () => {
        setErrorStartPuzzle(null);
        setSuccessStartPuzzle(null);
    }

    /**
     * UseEffect hook to open/close the badge and assign variables
     */
    useEffect(() => {
        if (errorStartPuzzle) {
            setSeverity('error');
            setAlertText(errorStartPuzzle);
            setOpen(true);
        } else if (successStartPuzzle) {
            setSeverity('success');
            setAlertText(successStartPuzzle);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [errorStartPuzzle, successStartPuzzle]);

    return (
        <AlertBadge 
            open={open} 
            severity={severity as AlertColor} 
            text={alertText} 
            onClose={handleCloseBadge} 
        />
    );
};