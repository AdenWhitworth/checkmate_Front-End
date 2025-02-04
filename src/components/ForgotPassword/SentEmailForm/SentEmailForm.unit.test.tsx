import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SentEmailForm from './SentEmailForm';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';

// Mock dependencies with exact paths from imports
jest.mock('../../../Providers/AuthProvider/AuthProvider');

// Mock the Button component with all necessary props
jest.mock('../../Button/Button', () => ({
    __esModule: true,
    default: ({ children, onClick, disabled, imgSrc, imgAlt }: any) => (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            data-testid="submit-button"
        >
            {imgSrc && <img src={imgSrc} alt={imgAlt} data-testid="button-icon" />}
            {children}
        </button>
    )
}));

describe('SentEmailForm', () => {
    const mockHandleSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: null
        });
    });

    it('renders form with title and instructions', () => {
        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        expect(screen.getByText('Check your email')).toBeInTheDocument();
        expect(screen.getByText(/Please check the email address/)).toBeInTheDocument();
    });

    it('renders envelope icon with correct attributes', () => {
        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        const envelopeIcon = screen.getByTestId('envelope-icon');
        expect(envelopeIcon).toBeInTheDocument();
    });

    it('calls handleSubmit when form is submitted', () => {
        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        const form = screen.getByTestId('sent-email-form');
        fireEvent.submit(form);
        
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('displays loading state in button when loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: true,
            error: null
        });

        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        expect(screen.getByText('Resending...')).toBeInTheDocument();
        expect(screen.queryByText('Resend Email')).not.toBeInTheDocument();
    });

    it('displays error message when error exists', () => {
        const testError = 'Failed to send email';
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: testError
        });

        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.getByText(testError)).toHaveClass('error-message');
    });

    it('disables submit button when loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: true,
            error: null
        });

        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
    });

    it('renders submit button with plane icon', () => {
        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        const icon = screen.getByTestId('button-icon');
        expect(icon).toBeInTheDocument();
        expect(icon.getAttribute('alt')).toBe('Send plane');
    });

    it('applies correct CSS classes', () => {
        render(<SentEmailForm handleSubmit={mockHandleSubmit} />);
        
        expect(screen.getByTestId('sent-email-form')).toHaveClass('forgot-password-form');
        expect(screen.getByTestId('form-logo')).toHaveClass('forgot-password-form-logo');
    });
});