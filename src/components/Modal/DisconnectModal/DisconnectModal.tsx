import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import king_logo_black from '../../../Images/King Logo Black.svg';

/**
 * DisconnectModal component that displays a modal when an opponent disconnects from the game.
 *
 * @component
 * @returns {JSX.Element|null} The rendered DisconnectModal component, or null if gameOver is false.
 */
export default function DisconnectModal(): JSX.Element | null {
    const { isOpponentDisconnected, handleCloseRoom, errorOver, loadingOver } = useGame();
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [buttonEnabled, setButtonEnabled] = useState(false);

    /**
     * UseEffect to start a countdown time when opponent disconnects
     */
    useEffect(() => {
        if (!isOpponentDisconnected || isOpponentDisconnected.includes("reconnected")) return;

        setTimeLeft(5 * 60);
        setButtonEnabled(false);

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setButtonEnabled(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpponentDisconnected]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!isOpponentDisconnected || isOpponentDisconnected.includes("reconnected")) return null;

    return (
        <Modal
            addButton={buttonEnabled}
            handleButtonClick={handleCloseRoom}
            buttonLabel={"Continue"}
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title={isOpponentDisconnected}
            body={`Opponent has ${formatTime(timeLeft)} left to join before forfeiting the game.`}
            loading={loadingOver}
            error={errorOver}
        />
    );
};
