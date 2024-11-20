import { useCallback, useState } from "react";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useAuth } from "../../Providers/AuthProvider/AuthProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useNavigate } from "react-router-dom";
import { UseNavigationOutput } from "./useNavigationTypes";

/**
 * Custom hook to handle navigation and menu interactions within the application.
 *
 * @returns {UseNavigationOutput} The returned functions and properties from the useNavigation hook.
 */
export const useNavigation = (): UseNavigationOutput => {
    const { logout, setIsLoginSelected } = useAuth();
    const { setExitGame, setForfeitGame } = useGame();
    const { setLobbySelection } = usePlayer();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    /**
     * Navigates the user to the home page.
     */
    const handleKingClick = useCallback(() => {
        navigate('/', { replace: true });
    }, [navigate]);

    /**
     * Opens the lobby selection, closes the menu, and navigates the user to the dashboard.
     */
    const handleBadgeClick = useCallback(() => {
        setLobbySelection(true);
        setIsMenuOpen(false);
        navigate('/dashboard', { replace: true });
    }, [setLobbySelection, navigate]);

    /**
     * Logs the user out and closes the menu.
     */
    const handleLogoutClick = useCallback(() => {
        logout();
        setIsMenuOpen(false);
    }, [logout]);

    /**
     * Opens the login page, closes the menu, and selects the login form.
     */
    const handleLoginClick = useCallback(() => {
        setIsLoginSelected(true);
        setIsMenuOpen(false);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    /**
     * Navigates the user to the dashboard.
     */
    const handleSendToDashboard = useCallback(() => {
        navigate('/dashboard', { replace: true });
    }, [navigate]);

    /**
     * Opens the signup page, closes the menu, and selects the signup form.
     */
    const handleSignupClick = useCallback(() => {
        setIsLoginSelected(false);
        setIsMenuOpen(false);
        navigate('/auth', { replace: true });
    }, [setIsLoginSelected, navigate]);

    /**
     * Closes the menu and sets the state to exit the game.
     */
    const handleArrowClick = useCallback(() => {
        setIsMenuOpen(false);
        setExitGame(true);
    }, [setExitGame]);

    /**
     * Closes the menu and sets the state to forfeit the game.
     */
    const handleFlagClick = useCallback(() => {
        setIsMenuOpen(false);
        setForfeitGame(true);
    }, [setForfeitGame]);

    /**
     * Navigates to the profile component.
     */
    const handleProfileClick = useCallback(() => {
        navigate('/profile', { replace: true });
    },[navigate]);

    /**
     * Navigates to the forgot password component.
     */
    const handleForgotPasswordClick = useCallback(() => {
        navigate('/forgotPassword', { replace: true });
    },[navigate]);

    /**
     * Toggles the state of the navigation menu.
     */
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
        handleProfileClick,
        toggleMenu, 
        isMenuOpen,
        handleSendToDashboard,
        handleForgotPasswordClick
    };
};
