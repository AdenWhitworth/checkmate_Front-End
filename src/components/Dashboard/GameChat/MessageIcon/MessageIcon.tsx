import React from "react";
import Badge from '@mui/material/Badge';
import { MessageIconProps } from "./MessageIconTypes";
import './MessageIcon.css';

/**
 * MessageIcon component displays an icon with a badge that indicates the number of new messages.
 * When the user clicks the icon, it triggers the `showMessages` callback to toggle the message view.
 * 
 * @component
 * @param {MessageIconProps} props - The props for the MessageEntry component.
 * @param {number} props.messageBadge - The number of new messages displayed as a badge count.
 * @param {string} props.messageStyle - The source path of the image to be displayed as the message icon.
 * @param {() => void} props.showMessages - A callback function to toggle the display of messages.
 *
 * @returns {JSX.Element} The MessageIcon component that displays an icon with a badge.
 */
export const MessageIcon = ({ 
  messageBadge, 
  messageStyle, 
  showMessages 
}: MessageIconProps): JSX.Element => {
  return (
    <div className="message-icon-container">
      <Badge 
        onClick={showMessages} 
        badgeContent={messageBadge} 
        color="primary"
      >
        <img 
          className="message-icon" 
          src={messageStyle} 
          alt="Message Icon" 
          aria-label="Message notification icon"
        />
      </Badge>
    </div>
  );
};