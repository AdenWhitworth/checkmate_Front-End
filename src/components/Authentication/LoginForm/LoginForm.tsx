import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { LoginFormProps } from './LoginFormTypes';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';

export default function LoginForm({
    handleInputChange,
    handleSubmit
}:LoginFormProps) {

    const { loadingAuth, error, setIsLoginSelected } = useAuth();

    const handleChangeToSignup = () => {
        setIsLoginSelected(false)
    };

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Welcome back</h2>

            <InputField
                onChange={handleInputChange} 
                name='email' 
                isRequired={true} 
                type='email' 
                label='Email' 
                isSpellCheck={false}
            ></InputField>

            <InputField
                onChange={handleInputChange} 
                name='password'
                isRequired={true} 
                type='password' 
                label='Password' 
                isSpellCheck={false}
            ></InputField>

            <Button type="submit" disabled={loadingAuth} styleType='primary'>
                {loadingAuth ? 'Signing In...' : 'Sign In'}
            </Button>

            <p>
                Don’t have an account?{'  '}
                <span onClick={handleChangeToSignup} className='auth-selection'>
                    Sign Up
                </span>
            </p>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}