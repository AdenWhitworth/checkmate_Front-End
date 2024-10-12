import React from 'react';
import Header from '../Header/Header';
import LandingSelections from './LandingSelections/LandingSelections';

export default function Landing(): JSX.Element {

    return (
        <>
            <Header></Header>
            <LandingSelections></LandingSelections>
        </>
    );
}