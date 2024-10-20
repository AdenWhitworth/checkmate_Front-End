/**
 * Props for the Modal component, defining various display elements and functions.
 *
 * @interface ModalProps
 * @property {string} [body] - Optional text to display as the body of the modal.
 * @property {boolean} addButton - Flag to indicate whether to display a button inside the modal.
 * @property {() => void} [handleButtonClick] - Optional function to handle button clicks inside the modal.
 * @property {string} buttonLabel - Text label for the button inside the modal.
 * @property {'primary' | 'secondary'} styleType - Type of button style, either 'primary' or 'secondary'.
 * @property {boolean} addClose - Flag to indicate whether to display the close icon in the modal.
 * @property {() => void} [handleCloseClick] - Optional function to handle clicking on the close icon.
 * @property {string} [logoSrc] - Optional source URL for a logo image to display in the modal.
 * @property {string} [title] - Optional title text to display in the modal.
 * @property {string | null} [error] - Optional error message to display in the modal.
 * @property {boolean} [loading] - Optional flag to indicate whether to display a loading spinner.
 */
export interface ModalProps { 
    body?: string;
    addButton: boolean;
    handleButtonClick?: () => void;
    buttonLabel: string;
    styleType: 'primary' | 'secondary';
    addClose: boolean;
    handleCloseClick?: () => void;
    logoSrc?: string;
    title?: string;
    error?: string | null;
    loading?: boolean;
}