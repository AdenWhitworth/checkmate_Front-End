import React from 'react';
import "./BotSettings.css";
import BotHelp from './BotHelp/BotHelp';
import BotOrientation from './BotOrientation/BotOrientation';

/**
 * A React functional component representing the settings section of the bot lobby.
 *
 * The `BotSettings` component contains two main settings:
 * - `BotHelp`: Allows configuration of hints and assistance levels during gameplay.
 * - `BotOrientation`: Allows the user to select their playing orientation (white, black, or random).
 *
 * @component
 * @returns {JSX.Element} A JSX element containing the bot settings section.
 */
export default function BotSettings(): JSX.Element {
    return (
        <div className="bot-settings">
            <BotHelp />
            <BotOrientation />
        </div>
    );
}
