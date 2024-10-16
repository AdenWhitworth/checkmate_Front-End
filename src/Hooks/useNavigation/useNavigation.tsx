import React, { useCallback } from "react";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useAuth } from "../../Providers/AuthProvider/AuthProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    const { logout, setIsLoginSelected } = useAuth();
    const { setExitGame, setForfeitGame } = useGame();
    const { setLobbySelection } = usePlayer();
    const navigate = useNavigate();

    const handleKingClick = useCallback(() => {
        navigate('/', { replace: true });
    }, [navigate]);

    const handleBadgeClick = useCallback(() => {
        setLobbySelection(true);
        navigate('/dashboard', { replace: true });
    }, [setLobbySelection, navigate]);

    const handleLogoutClick = useCallback(() => {
        logout();
    }, [logout]);

    const handleLoginClick = useCallback(() => {
        setIsLoginSelected(true);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    const handleSignupClick = useCallback(() => {
        setIsLoginSelected(false);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    const handleArrowClick = useCallback(() => {
        setExitGame(true);
    }, [setExitGame]);

    const handleFlagClick = useCallback(() => {
        setForfeitGame(true);
    }, [setForfeitGame]);

    return {
        handleKingClick,
        handleBadgeClick,
        handleLogoutClick,
        handleLoginClick,
        handleSignupClick,
        handleArrowClick,
        handleFlagClick,
    };
};
