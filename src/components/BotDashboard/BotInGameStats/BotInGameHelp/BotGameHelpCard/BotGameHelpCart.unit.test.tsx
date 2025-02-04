import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotGameHelpCard from './BotGameHelpCard';

describe('BotGameHelpCard', () => {
    const defaultProps = {
        imgSrc: '/test-image.png',
        imgAlt: 'Test Icon',
        label: 'Test Label',
        onClick: jest.fn(),
        disable: false,
        loading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders basic card elements correctly', () => {
        render(<BotGameHelpCard {...defaultProps} />);

        expect(screen.getByAltText('Test Icon')).toBeInTheDocument();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('handles click events when not disabled', () => {
        render(<BotGameHelpCard {...defaultProps} />);

        const card = screen.getByTestId('help-card');
        fireEvent.click(card);

        expect(defaultProps.onClick).toHaveBeenCalled();
    });

    it('shows loading dots when loading is true', () => {
        render(<BotGameHelpCard {...defaultProps} loading={true} />);

        expect(screen.queryByAltText('Test Icon')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
        expect(screen.getByTestId('loading-dots')).toBeInTheDocument();
    });

    it('applies disabled class when disable prop is true', () => {
        render(<BotGameHelpCard {...defaultProps} disable={true} />);

        const card = screen.getByTestId('help-card');
        expect(card).toHaveClass('card-disable');
    });

    it('applies active class when disable prop is false', () => {
        render(<BotGameHelpCard {...defaultProps} disable={false} />);

        const card = screen.getByTestId('help-card');
        expect(card).toHaveClass('card-active');
    });

    describe('tally dots rendering', () => {
        it('renders no tally dots when tallyCount is undefined', () => {
            render(<BotGameHelpCard {...defaultProps} />);

            expect(screen.queryByTestId('tally-dots')).not.toBeInTheDocument();
        });

        it('renders correct number of active tally dots', () => {
            render(<BotGameHelpCard {...defaultProps} tallyCount={2} />);

            const activeDots = screen.getAllByTestId('tally-dot').filter(dot => 
                dot.classList.contains('active-tally')
            );
            expect(activeDots).toHaveLength(2);
        });

        it('renders three inactive dots when tallyCount is 0', () => {
            render(<BotGameHelpCard {...defaultProps} tallyCount={0} />);

            const inactiveDots = screen.getAllByTestId('tally-dot').filter(dot => 
                dot.classList.contains('inactive-tally')
            );
            expect(inactiveDots).toHaveLength(3);
        });

        it('renders no tally dots when tallyCount is greater than 3', () => {
            render(<BotGameHelpCard {...defaultProps} tallyCount={4} />);

            expect(screen.queryByTestId('tally-dots')).not.toBeInTheDocument();
        });
    });
});