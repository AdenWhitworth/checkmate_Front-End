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