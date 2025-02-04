import React from 'react';
import { render, screen } from '@testing-library/react';
import BotLobbyTitle from './BotLobbyTitle';

describe('BotLobbyTitle', () => {
    it('renders the title text correctly', () => {
        render(<BotLobbyTitle />);
        expect(screen.getByText('Play Bots')).toBeInTheDocument();
    });

    it('renders the bot icon with correct alt text', () => {
        render(<BotLobbyTitle />);
        expect(screen.getByAltText('Bot icon')).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
        render(<BotLobbyTitle />);
        
        expect(screen.getByTestId('bot-lobby-title')).toHaveClass('bot-lobby-title');
        expect(screen.getByTestId('bot-lobby-title-img')).toHaveClass('bot-lobby-title-img');
    });
});