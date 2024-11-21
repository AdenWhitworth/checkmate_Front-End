import React, { useEffect, useState, useCallback } from 'react';
import './ProfileCircle.css';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';
import { ProfileCircleProps } from './ProfileCircleTypes';

/**
 * ProfileCircle Component
 * 
 * Displays a circular profile element with user initials and a unique background color.
 * 
 * @param {ProfileCircleProps} props - The properties passed to the component.
 * @param {function} [props.onClick] - Optional callback to handle click events on the profile circle.
 * @returns {JSX.Element} The rendered ProfileCircle component.
 */
export default function ProfileCircle({
    onClick
}: ProfileCircleProps): JSX.Element {
    const { playerStatic } = usePlayer();
    const [initials, setInitials] = useState<string>("");

    /**
     * Generates the initials for the profile circle based on the username of the player.
     * 
     * - Single-word usernames use the first two letters.
     * - Multi-word usernames use the first letter of the first two words.
     * - Non-alphanumeric characters are ignored.
     * - If the username is invalid or empty, returns "??".
     * 
     * @returns {string} The generated initials for the player.
     */
    const getProfileInitials = useCallback((): string => {
        if (!playerStatic) return "";
        const sanitized = playerStatic.username.trim().toUpperCase();
        const words = sanitized.split(/[^A-Z0-9]/).filter(Boolean);

        if (words.length === 0) return "";
        if (words.length === 1) return words[0].slice(0, 2).padEnd(2, words[0][0]);

        return words[0][0] + words[1][0];
    }, [playerStatic]);

    /**
     * Generates a unique background color based on the player's username.
     * 
     * @param {string} str - The string to hash into a color.
     * @returns {string} The HSL color string.
     */
    const hashStringToColor = (str: string): string => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        const saturation = 70;
        const lightness = 60;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const backgroundColor = playerStatic ? hashStringToColor(playerStatic.username) : "#ccc";

    /**
     * Updates the initials state whenever the playerStatic object changes.
     */
    useEffect(() => {
        setInitials(getProfileInitials());
    }, [getProfileInitials]);

    return (
        <div onClick={onClick} className='profile-circle' style={{ backgroundColor }}>
            <h4>{initials}</h4>
        </div>
    );
}