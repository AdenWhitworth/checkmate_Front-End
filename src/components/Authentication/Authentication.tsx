import React, { useState, useEffect, useRef} from 'react';
import king_logo from '../../Images/King Logo White.svg';
import "./Authentication.css";
import LoginForm from './LoginForm/LoginForm';
import SignupForm from './SignupForm/SignupForm';
import { useNavigate } from 'react-router-dom';
import { FormData } from './AuthenticationTypes';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';

export default function Authentication() {

    const navigate = useNavigate();
    const hasNavigated = useRef<boolean>(false);
    const {currentUser, resetError, login, signup, isLoginSelected } = useAuth();
    
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        username: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleReturnLanding = () => {
        navigate('/', { replace: true });
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login(formData.email || '', formData.password || '');
    };

    const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signup(formData.email || '', formData.password || '', formData.username || '');
    };

    useEffect(() => {
        resetError();
    }, [isLoginSelected, resetError]);

    useEffect(() => {
        if(currentUser){
            navigate('/dashboard', { replace: true });
            hasNavigated.current = true;
        }
    }, [currentUser, navigate]);

    return (
        <section className='auth'>
            <div className='auth-content'>
                <div className='auth-logo'>
                    <img onClick={handleReturnLanding} className='auth-logo-img' src={king_logo} alt='King Logo'></img>
                </div>

                {isLoginSelected? (
                    <LoginForm 
                        handleInputChange={handleInputChange}
                        handleSubmit={handleLoginSubmit}
                    ></LoginForm>
                ):(
                    <SignupForm
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSignUpSubmit}
                    ></SignupForm>
                )}
            </div>
        </section>
    );
}