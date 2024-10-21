/**
 * Props for the HamburgerMenu component, representing the menu toggle function and its state.
 * 
 * @interface HamburgerMenuProps
 * 
 * @property {() => void} toggleMenu - Function to toggle the state of the hamburger menu.
 * @property {boolean} isMenuOpen - Boolean indicating whether the hamburger menu is currently open or closed.
 */
export interface HamburgerMenuProps {
    toggleMenu: () => void;
    isMenuOpen: boolean;
}