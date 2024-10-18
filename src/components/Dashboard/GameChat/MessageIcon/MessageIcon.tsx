import React from "react";
import Badge from '@mui/material/Badge';
import { MessageIconProps } from "./MessageIconTypes";
import './MessageIcon.css';

export const MessageIcon = ({ 
    messageBadge, 
    messageStyle, 
    showMessages 
}: MessageIconProps) => {
  return (
    <div className="message-icon-container">
      <Badge onClick={showMessages} badgeContent={messageBadge} color="primary">
        <img className="message-icon" src={messageStyle} alt="Message Icon" />
      </Badge>
    </div>
  );
};
