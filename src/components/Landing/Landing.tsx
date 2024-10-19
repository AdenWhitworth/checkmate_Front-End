import React from 'react';
import Header from '../Header/Header';
import LandingSelections from './LandingSelections/LandingSelections';

/**
 * Landing component that serves as the main landing page for the application.
 * 
 * @component
 * @returns {JSX.Element} The rendered Landing component, which includes the Header and LandingSelections components.
 */
export default function Landing(): JSX.Element {
    return (
        <>
            <Header></Header>
            <LandingSelections></LandingSelections>
        </>
    );
}