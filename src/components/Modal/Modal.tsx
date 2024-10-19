import React from 'react';
import x_circle from '../../Images/x-circle-black.svg';
import Button from '../Button/Button';
import './Modal.css';
import { ModalProps } from './ModalTypes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

/**
 * Modal component displays a styled modal with optional content, a button, and close functionality.
 * It supports loading states, error messages, and additional UI elements such as a logo and title.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.handleCloseClick - Function to handle clicking on the close icon.
 * @param {() => void} [props.handleButtonClick] - Function to handle clicking on the button inside the modal.
 * @param {string} [props.body] - Text to be displayed as the body of the modal.
 * @param {boolean} [props.addClose=false] - Flag to display the close icon.
 * @param {boolean} [props.addButton=false] - Flag to display the button inside the modal.
 * @param {string} [props.buttonLabel=''] - Label for the button inside the modal.
 * @param {'primary' | 'secondary'} [props.styleType='primary'] - Style type of the button.
 * @param {string} [props.logoSrc] - Source of the logo image to be displayed in the modal.
 * @param {string} [props.title] - Title text to be displayed in the modal.
 * @param {string} [props.error] - Error message to be displayed inside the modal.
 * @param {boolean} [props.loading=false] - Indicates whether the loading spinner should be displayed.
 *
 * @returns {JSX.Element} The rendered Modal component.
 */
export default function Modal({
    handleCloseClick, 
    handleButtonClick, 
    body, 
    addClose = false, 
    addButton = false, 
    buttonLabel = '', 
    styleType = 'primary',
    logoSrc,
    title,
    error,
    loading,
}: ModalProps) {

    return (
        <div className="modal">
            <div className='modal-content'>
                {loading? (
                    <LoadingSpinner></LoadingSpinner>
                ):(
                    <>
                        {addClose &&
                            <div className='modal-close'>
                                <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
                            </div>
                        }

                        {logoSrc && <img className="modal-logo" src={logoSrc} alt='Modal Logo'></img>}
                        {title && <h3 className='modal-title'>{title}</h3>}
                        {body && <p>{body}</p>}

                        {addButton?

                            <div className='modal-btns'>
                                <Button styleType={styleType} onClick={handleButtonClick}>{buttonLabel}</Button>
                            </div>
                            :
                            <div className='modal-btns hidden'>
                                <Button styleType={styleType} >Hidden</Button>
                            </div>
                        }

                        {error && <p className="error-message">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
}