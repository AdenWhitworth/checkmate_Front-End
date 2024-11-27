/**
 * Interface representing the output of the useNavigation hook.
 *
 * @interface UseNavigationOutput
 * @property {function} handleKingClick - Navigates the user to the home page.
 * @property {function} handleBadgeClick - Opens the lobby selection, closes the menu, and navigates the user to the dashboard.
 * @property {function} handleLogoutClick - Logs the user out and closes the menu.
 * @property {function} handleLoginClick - Opens the login page, closes the menu, and selects the login form.
 * @property {function} handleSignupClick - Opens the signup page, closes the menu, and selects the signup form.
 * @property {function} handleArrowClick - Closes the menu and sets the state to exit the game.
 * @property {function} handleFlagClick - Closes the menu and sets the state to forfeit the game.
 * @property {function} handleProfileClick - Function to be called when the profile circle is clicked.
 * @property {function} toggleMenu - Toggles the state of the navigation menu.
 * @property {boolean} isMenuOpen - A boolean indicating whether the navigation menu is currently open or closed.
 * @property {function} handleSendToDashboard - Navigates the user to the dashboard page.
 * @property {function} handleSendToBotDashboard - Navigates the user to the bot dashboard page.
 * @property {function} handleForgotPasswordClick - Navigates the user to the forgot password page.
 * @property {function} handleBotFlagClick - Closes the menu and sets the state to forfeit the bot game.
 */
export interface UseNavigationOutput {
    handleKingClick: () => void;
    handleBadgeClick: () => void;
    handleLogoutClick: () => void;
    handleLoginClick: () => void;
    handleSignupClick: () => void;
    handleArrowClick: () => void;
    handleFlagClick: () => void;
    handleProfileClick:  () => void;
    toggleMenu: () => void;
    isMenuOpen: boolean;
    handleSendToDashboard: () => void;
    handleSendToBotDashboard: () => void;
    handleForgotPasswordClick: () => void;
    handleBotFlagClick: () => void;
}