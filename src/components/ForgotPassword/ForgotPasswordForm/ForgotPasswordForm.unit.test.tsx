import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';

jest.mock('../../../Providers/AuthProvider/AuthProvider');
jest.mock('../../../Images/Paper Plane.svg', () => 'paper-plane.svg');
jest.mock('../../InputField/InputField', () => ({
    __esModule: true,
    default: ({ label, onChange, name, type }: { 
        label: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        name: string;
        type: string;
    }) => (
        <input
            data-testid="email-input"
            aria-label={label}
            onChange={onChange}
            name={name}
            type={type}
        />
    )
}));

describe('ForgotPasswordForm', () => {
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();

    const defaultProps = {
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: null
        });
    });

    it('renders form with title and description', () => {
        render(<ForgotPasswordForm {...defaultProps} />);
        
        expect(screen.getByText('Reset your password')).toBeInTheDocument();
        expect(screen.getByText(/Enter your Email address/)).toBeInTheDocument();
    });

    it('renders email input field', () => {
        render(<ForgotPasswordForm {...defaultProps} />);
        
        const emailInput = screen.getByTestId('email-input');
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('calls handleInputChange when email input changes', () => {
        render(<ForgotPasswordForm {...defaultProps} />);
        
        const emailInput = screen.getByTestId('email-input');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        
        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleSubmit when form is submitted', () => {
        render(<ForgotPasswordForm {...defaultProps} />);
        
        const form = screen.getByTestId('forgot-password-form');
        fireEvent.submit(form);
        
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('displays loading state in button when loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: true,
            error: null
        });

        render(<ForgotPasswordForm {...defaultProps} />);
        
        expect(screen.getByText('Sending...')).toBeInTheDocument();
        expect(screen.queryByText('Send Email')).not.toBeInTheDocument();
    });

    it('displays error message when error exists', () => {
        const testError = 'Invalid email address';
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: testError
        });

        render(<ForgotPasswordForm {...defaultProps} />);
        
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.getByText(testError)).toHaveClass('error-message');
    });

    it('disables submit button when loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: true,
            error: null
        });

        render(<ForgotPasswordForm {...defaultProps} />);
        
        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeDisabled();
    });

    it('renders submit button with correct icon', () => {
        render(<ForgotPasswordForm {...defaultProps} />);
        
        const icon = screen.getByAltText('Send plane');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('src', 'paper-plane.svg');
    });
});