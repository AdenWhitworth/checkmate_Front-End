import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useAuth } from './../../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from './../../../Hooks/useNavigation/useNavigation';

jest.mock('./../../../Providers/AuthProvider/AuthProvider');
jest.mock('./../../../Hooks/useNavigation/useNavigation');

describe('LoginForm Component', () => {
    // Setup mock functions
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const mockSetIsLoginSelected = jest.fn();
    const mockHandleForgotPasswordClick = jest.fn();

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Mock the hooks' return values
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: null,
            setIsLoginSelected: mockSetIsLoginSelected
        });
        
        (useNavigation as jest.Mock).mockReturnValue({
            handleForgotPasswordClick: mockHandleForgotPasswordClick
        });
    });

    it('renders all form elements correctly', () => {
        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('calls handleInputChange when input values change', () => {
        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const emailInput = screen.getByTestId('email-input');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleSubmit when form is submitted', () => {
        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const form = screen.getByTestId('login-form');
        fireEvent.submit(form);

        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('shows loading state when loadingAuth is true', () => {
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: true,
            error: null,
            setIsLoginSelected: mockSetIsLoginSelected
        });

        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByText('Signing In...')).toBeInTheDocument();
    });

    it('displays error message when error exists', () => {
        const errorMessage = 'Invalid credentials';
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: errorMessage,
            setIsLoginSelected: mockSetIsLoginSelected
        });

        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('calls setIsLoginSelected when clicking Sign Up', () => {
        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const signUpLink = screen.getByText('Sign Up');
        fireEvent.click(signUpLink);

        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(false);
    });

    it('calls handleForgotPasswordClick when clicking Forgot Password', () => {
        render(
            <LoginForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const forgotPasswordLink = screen.getByText('Forgot Password?');
        fireEvent.click(forgotPasswordLink);

        expect(mockHandleForgotPasswordClick).toHaveBeenCalled();
    });
});