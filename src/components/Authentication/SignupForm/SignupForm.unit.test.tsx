import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from './SignupForm';
import { useAuth } from './../../../Providers/AuthProvider/AuthProvider';

jest.mock('./../../../Providers/AuthProvider/AuthProvider');

describe('SignupForm', () => {
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const mockSetIsLoginSelected = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: null,
            setIsLoginSelected: mockSetIsLoginSelected
        });
    });

    it('renders all form elements correctly', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByText('Create an account')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('calls handleInputChange when username input changes', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const usernameInput = screen.getByTestId('username-input');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleInputChange when email input changes', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const emailInput = screen.getByTestId('email-input');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleInputChange when password input changes', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const passwordInput = screen.getByTestId('password-input');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleSubmit when form is submitted', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const form = screen.getByTestId('signup-form');
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
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('displays error message when error exists', () => {
        const errorMessage = 'Email already in use';
        (useAuth as jest.Mock).mockReturnValue({
            loadingAuth: false,
            error: errorMessage,
            setIsLoginSelected: mockSetIsLoginSelected
        });

        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('calls setIsLoginSelected when clicking Login', () => {
        render(
            <SignupForm
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        const loginLink = screen.getByText('Login');
        fireEvent.click(loginLink);

        expect(mockSetIsLoginSelected).toHaveBeenCalledWith(true);
    });
});