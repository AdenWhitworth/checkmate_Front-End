import React from 'react';
import { render, screen } from '@testing-library/react';
import BotSettings from './BotSettings';

jest.mock('./BotHelp/BotHelp', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-help">Bot Help Component</div>
}));

jest.mock('./BotOrientation/BotOrientation', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-orientation">Bot Orientation Component</div>
}));

describe('BotSettings', () => {
    it('renders the component with correct class', () => {
        render(<BotSettings />);
        expect(screen.getByTestId('bot-settings')).toHaveClass('bot-settings');
    });

    it('renders both BotHelp and BotOrientation components', () => {
        render(<BotSettings />);
        
        expect(screen.getByTestId('bot-help')).toBeInTheDocument();
        expect(screen.getByTestId('bot-orientation')).toBeInTheDocument();
    });

    it('renders components in correct order', () => {
        render(<BotSettings />);
        
        const elements = screen.getAllByTestId(/^bot-/);
        expect(elements).toHaveLength(3); // including container
        expect(elements[1]).toHaveAttribute('data-testid', 'bot-help');
        expect(elements[2]).toHaveAttribute('data-testid', 'bot-orientation');
    });
});