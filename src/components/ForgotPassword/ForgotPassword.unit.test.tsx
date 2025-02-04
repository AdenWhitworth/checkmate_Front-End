import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';

// Mock dependencies
jest.mock('../../Providers/AuthProvider/AuthProvider');
jest.mock('../../Hooks/useNavigation/useNavigation');
jest.mock('../../Images/King Logo White.svg', () => 'king-logo.svg');

// Mock child components
jest.mock('./ForgotPasswordForm/ForgotPasswordForm', () => ({
    __esModule: true,
    default: ({ handleInputChange, handleSubmit }: any) => (
        <div data-testid="forgot-password-form">
            <input 
                data-testid="email-input" 
                onChange={handleInputChange}
                name="email"
            />
            <button onClick={(e) => handleSubmit(e)}>Submit</button>
        </div>
    )
}));

jest.mock('./SentEmailForm/SentEmailForm', () => ({
    __esModule: true,
    default: ({ handleSubmit }: any) => (
        <div data-testid="sent-email-form">
            <button onClick={(e) => handleSubmit(e)}>Resend</button>
        </div>
    )
}));

describe('ForgotPassword', () => {
    const mockForgotPassword = jest.fn();
    const mockLogout = jest.fn();
    const mockHandleKingClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            forgotPassword: mockForgotPassword,
            currentUser: null,
            logout: mockLogout
        });
        (useNavigation as jest.Mock).mockReturnValue({
            handleKingClick: mockHandleKingClick
        });
    });

    it('renders logo with correct attributes', () => {
        render(<ForgotPassword />);
        
        const logo = screen.getByAltText('King Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'king-logo.svg');
        expect(logo).toHaveClass('forgot-password-logo-img');
    });

    it('handles logo click', () => {
        render(<ForgotPassword />);
        
        fireEvent.click(screen.getByAltText('King Logo'));
        expect(mockHandleKingClick).toHaveBeenCalledTimes(1);
    });

    it('initially renders ForgotPasswordForm', () => {
        render(<ForgotPassword />);
        
        expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sent-email-form')).not.toBeInTheDocument();
    });

    it('updates email in form data when input changes', () => {
        render(<ForgotPassword />);
        
        const emailInput = screen.getByTestId('email-input');
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        
        expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    describe('form submission', () => {
        it('shows sent email form after successful submission', async () => {
            mockForgotPassword.mockResolvedValueOnce(undefined);
            
            render(<ForgotPassword />);
            
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.getByTestId('sent-email-form')).toBeInTheDocument();
            });
        });

        it('removes forgot password form after successful submission', async () => {
            mockForgotPassword.mockResolvedValueOnce(undefined);
            
            render(<ForgotPassword />);
            
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();
            });
        });

        it('logs out current user if exists', async () => {
            (useAuth as jest.Mock).mockReturnValue({
                forgotPassword: mockForgotPassword,
                currentUser: { id: '123' },
                logout: mockLogout
            });

            render(<ForgotPassword />);
            
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockLogout).toHaveBeenCalled();
            });
        });

        it('logs error on submission failure', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const testError = new Error('Test error');
            mockForgotPassword.mockRejectedValueOnce(testError);

            render(<ForgotPassword />);
            
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Error occured with forgot password:',
                    testError
                );
            });

            consoleErrorSpy.mockRestore();
        });
    });

    it('applies correct CSS classes', () => {
        render(<ForgotPassword />);
        
        expect(screen.getByTestId('forgot-password')).toHaveClass('forgot-password');
        expect(screen.getByTestId('forgot-password-content')).toHaveClass('forgot-password-content');
        expect(screen.getByTestId('forgot-password-logo')).toHaveClass('forgot-password-logo');
    });
});