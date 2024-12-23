import { useCallback, useState } from "react";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useAuth } from "../../Providers/AuthProvider/AuthProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useNavigate } from "react-router-dom";
import { UseNavigationOutput } from "./useNavigationTypes";
import { useBot } from "../../Providers/BotProvider/BotProvider";
import { usePuzzle } from "../../Providers/PuzzleProvider/PuzzleProvider";

/**
 * Custom hook to handle navigation and menu interactions within the application.
 *
 * @returns {UseNavigationOutput} The returned functions and properties from the useNavigation hook.
 */
export const useNavigation = (): UseNavigationOutput => {
    const { logout, setIsLoginSelected } = useAuth();
    const { setExitGame, setForfeitGame } = useGame();
    const { setForfeitBotGame, setBotGame } = useBot();
    const { setPuzzle } = usePuzzle();
    const { setLobbySelection } = usePlayer();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    /**
     * Navigates the user to the home page.
     */
    const handleKingClick = useCallback(() => {
        setBotGame(null);
        setPuzzle(null);
        navigate('/', { replace: true });
    }, [navigate, setBotGame, setPuzzle]);

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
     * Navigates the user to the bot dashboard.
     */
    const handleSendToBotDashboard = useCallback(() => {
        navigate('/botDashboard', { replace: true });
    }, [navigate]);

    /**
     * Navigates the user to the puzzle dashboard.
     */
    const handleSendToPuzzleDashboard = useCallback(() => {
        navigate('/PuzzleDashboard', { replace: true });
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
     * Closes the menu and sets the state to forfeit the bot game.
     */
    const handleBotFlagClick = useCallback(() => {
        setIsMenuOpen(false);
        setForfeitBotGame(true);
    }, [setForfeitBotGame]);

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
        handleSendToBotDashboard,
        handleForgotPasswordClick,
        handleBotFlagClick,
        handleSendToPuzzleDashboard
    };
};
