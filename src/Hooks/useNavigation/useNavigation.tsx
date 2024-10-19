import React, { useCallback, useState } from "react";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useAuth } from "../../Providers/AuthProvider/AuthProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    const { logout, setIsLoginSelected } = useAuth();
    const { setExitGame, setForfeitGame } = useGame();
    const { setLobbySelection } = usePlayer();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleKingClick = useCallback(() => {
        navigate('/', { replace: true });
    }, [navigate]);

    const handleBadgeClick = useCallback(() => {
        setLobbySelection(true);
        setIsMenuOpen(false);
        navigate('/dashboard', { replace: true });
    }, [setLobbySelection, navigate]);

    const handleLogoutClick = useCallback(() => {
        logout();
        setIsMenuOpen(false);
    }, [logout]);

    const handleLoginClick = useCallback(() => {
        setIsLoginSelected(true);
        setIsMenuOpen(false);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    const handleSendToDashboard = useCallback(() => {
        navigate('/dashboard', { replace: true });
    }, [navigate]);

    const handleSignupClick = useCallback(() => {
        setIsLoginSelected(false);
        setIsMenuOpen(false);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    const handleArrowClick = useCallback(() => {
        setIsMenuOpen(false);
        setExitGame(true);
    }, [setExitGame]);

    const handleFlagClick = useCallback(() => {
        setIsMenuOpen(false);
        setForfeitGame(true);
    }, [setForfeitGame]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((previous) => !previous);
    }, [setIsMenuOpen]);

    return {
        handleKingClick,
        handleBadgeClick,
        handleLogoutClick,
        handleLoginClick,
        handleSignupClick,
        handleArrowClick,
        handleFlagClick,
        toggleMenu, 
        isMenuOpen,
        handleSendToDashboard
    };
};
