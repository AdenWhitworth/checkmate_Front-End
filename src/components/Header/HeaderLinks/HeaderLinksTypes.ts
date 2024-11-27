/**
 * Props for the HeaderLinks component, representing various event handlers and the menu state.
 * 
 * @interface HeaderLinksProps
 * 
 * @property {() => void} handleBadgeClick - Function to be called when the notifications badge is clicked.
 * @property {() => void} handleLogoutClick - Function to be called when the user clicks the logout button.
 * @property {() => void} handleLoginClick - Function to be called when the user clicks the login button.
 * @property {() => void} handleSignupClick - Function to be called when the user clicks the signup button.
 * @property {() => void} handleArrowClick - Function to be called when the exit arrow button is clicked.
 * @property {() => void} handleFlagClick - Function to be called when the forfeit flag button is clicked.
 * @property {() => void} handleProfileClick - Function to be called when the profile circle is clicked.
 * @property {() => void} handleBotFlagClick - Function to be called when the forfeit flag button is clicked against a bot.
 * @property {boolean} isMenuOpen - Boolean indicating whether the navigation menu is open or closed.
 */
export interface HeaderLinksProps{
    handleBadgeClick: () => void;
    handleLogoutClick: () => void;
    handleLoginClick: () => void;
    handleSignupClick: () => void;
    handleArrowClick: () => void;
    handleFlagClick: () => void;
    handleProfileClick: () => void;
    handleBotFlagClick: () => void;
    isMenuOpen: boolean;
}
