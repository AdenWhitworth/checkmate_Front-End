import React from 'react';
import { GamePieceProps } from './GamePieceTypes';

/**
 * GamePiece component that displays an individual game piece for a player.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.piece - The piece object containing style and image details.
 * @param {string} props.piece.style - The CSS class name for styling the piece.
 * @param {string} props.piece.img - The source URL for the piece image.
 * @param {string} props.username - The username of the player owning this piece.
 *
 * @returns {JSX.Element} The rendered GamePiece component.
 */
export default function GamePiece({ piece, username }: GamePieceProps): JSX.Element {
    return (
        <img
            className={piece.style}
            src={piece.img}
            alt={`${username}`}
        />
    );
}