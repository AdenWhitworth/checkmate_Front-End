import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { SignupFormProps } from './SignupFormTypes';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';

export default function SignupForm({
    handleInputChange,
}:SignupFormProps) {

    const { loadingAuth, error, setIsLoginSelected } = useAuth();

    const handleChangeToLogin = () => {
        setIsLoginSelected(true)
    };

    return (
        <form className='auth-form'>
            <h2>Create an account</h2>

            <InputField
                onChange={handleInputChange} 
                name='username' 
                isRequired={true} 
                type='text' 
                label='Username' 
                isSpellCheck={false}
            ></InputField>
            
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
                {loadingAuth ? 'Creating...' : 'Create'}
            </Button>

            <p>
                Already have an account?{'  '}
                <span onClick={handleChangeToLogin} className='auth-selection'>
                    Login
                </span>
            </p>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}