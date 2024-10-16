import React from 'react';
import x_circle from '../../Images/x-circle-black.svg';
import Button from '../Button/Button';
import './Modal.css';
import { ModalProps } from './ModalTypes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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
                        {addClose?
                            <div className='modal-close'>
                                <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
                            </div>
                            :
                            <></>
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