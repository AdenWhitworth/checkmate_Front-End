import React from 'react';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertBadgeProps } from './AlertBadgeTypes';

export default function AlertBadge({
  severity = 'info',
  text,
  onClose,
  open
}: AlertBadgeProps) {

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Slide in={open} direction={isMobile ? "down" : "up"} timeout={500}>
            <Alert 
                sx={{ 
                    position: "absolute", 
                    marginLeft: { xs: "2vw", md: "1vw" }, 
                    boxSizing: 'border-box', 
                    top: { xs: "2vw", md: "unset" }, 
                    bottom: { xs: "unset", md: "1vw" }, 
                    width: { xs: "96vw", md: "98vw" } 
                }} 
                severity={severity} 
                onClose={onClose}
            >
                {text}
            </Alert>
        </Slide>
    );
}

