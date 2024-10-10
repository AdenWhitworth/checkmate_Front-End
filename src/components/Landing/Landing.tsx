import React from 'react';
import Header from '../Header/Header';
import LandingSelections from './LandingSelections/LandingSelections';
import { LandingProps } from './LandingTypes';

export default function Landing({
}: LandingProps): JSX.Element {

    return (
        <>
            <Header></Header>
            <LandingSelections></LandingSelections>
        </>
    );
}