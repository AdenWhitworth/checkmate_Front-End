import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Authentication from './Authentication';
import { useAuth } from './../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from './../../Hooks/useNavigation/useNavigation';

jest.mock('./../../Providers/AuthProvider/AuthProvider');
jest.mock('./../../Hooks/useNavigation/useNavigation');

describe('Authentication', () => {
    const mockHandleKingClick = jest.fn();
    const mockHandleSendToDashboard = jest.fn();
    const mockLogin = jest.fn();
    const mockSignup = jest.fn();
    const mockResetError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useNavigation as jest.Mock).mockReturnValue({
            handleKingClick: mockHandleKingClick,
            handleSendToDashboard: mockHandleSendToDashboard
        });

        (useAuth as jest.Mock).mockReturnValue({
            currentUser: null,
            resetError: mockResetError,
            login: mockLogin,
            signup: mockSignup,
            isLoginSelected: true
        });
    });

    it('renders the authentication section with logo', () => {
        render(<Authentication />);
        
        expect(screen.getByTestId('auth-section')).toBeInTheDocument();
        expect(screen.getByAltText('King Logo')).toBeInTheDocument();
    });

    it('handles logo click', () => {
        render(<Authentication />);
        
        const logo = screen.getByAltText('King Logo');
        fireEvent.click(logo);
        
        expect(mockHandleKingClick).toHaveBeenCalled();
    });

    it('renders LoginForm when isLoginSelected is true', () => {
        render(<Authentication />);
        
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('renders SignupForm when isLoginSelected is false', () => {
        (useAuth as jest.Mock).mockReturnValue({
            currentUser: null,
            resetError: mockResetError,
            login: mockLogin,
            signup: mockSignup,
            isLoginSelected: false
        });

        render(<Authentication />);
        
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    });

    it('calls login with correct data on login form submission', () => {
        render(<Authentication />);
        
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const form = screen.getByTestId('login-form');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.submit(form);

        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('calls signup with correct data on signup form submission', () => {
        (useAuth as jest.Mock).mockReturnValue({
            currentUser: null,
            resetError: mockResetError,
            login: mockLogin,
            signup: mockSignup,
            isLoginSelected: false
        });

        render(<Authentication />);
        
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const usernameInput = screen.getByTestId('username-input');
        const form = screen.getByTestId('signup-form');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.submit(form);

        expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
    });

    it('redirects to dashboard when user is authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            currentUser: { uid: '123' },
            resetError: mockResetError,
            login: mockLogin,
            signup: mockSignup,
            isLoginSelected: true
        });

        render(<Authentication />);
        
        expect(mockHandleSendToDashboard).toHaveBeenCalled();
    });

    it('calls resetError when switching between login and signup', () => {
        const { rerender } = render(<Authentication />);

        // Change isLoginSelected to false
        (useAuth as jest.Mock).mockReturnValue({
            currentUser: null,
            resetError: mockResetError,
            login: mockLogin,
            signup: mockSignup,
            isLoginSelected: false
        });

        rerender(<Authentication />);
        
        expect(mockResetError).toHaveBeenCalled();
    });
});