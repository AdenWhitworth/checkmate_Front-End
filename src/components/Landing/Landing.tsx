import React from 'react';
import Button from '../Button/Button';

export default function Landing(): JSX.Element {

    return (
        <div>
            <Button styleType='primary'>
                Primary
            </Button>

            <Button styleType='secondary'>
                Secondary
            </Button>
        </div>
    );
}