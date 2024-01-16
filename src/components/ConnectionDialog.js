import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import exclamation from "../Images/Exclamation.svg";
import "../App.css";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const FillButton = styled(Button)(({ theme }) => ({
  color: '#000000',
  borderColor: '#FFCD05',
  backgroundColor: '#FFCD05',
  '&:hover': {
    backgroundColor: '#B78B02',
    borderColor: '#B78B02',
  },
}));

const HollowButton = styled(Button)(({ theme }) => ({
  color: '#FFCD05',
  borderColor: '#FFCD05',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '#FFF9CD',
    color: '#B78B02',
    borderColor: '#B78B02',
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: "70%", md: 400},
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: '0',
  borderRadius: 5,
};

export default function CustomDialog({ open, networkReason, handleContinue }) {

  const [reason, setReason] = useState("");
  const [reasonBtn, setReasonBtn] = useState("");


  useEffect(() => {
    //depending on the error reason send display custom message
    if (networkReason === "Username"){
      setReason("Unable to set username. Please try again.");
      setReasonBtn("Refresh");
    } else if (networkReason === "Move"){
      setReason("Your last move was not made. Please try again.");
      setReasonBtn("Continue");
    } else if (networkReason === "Forfeit"){
      setReason("Unable to leave the game. Please try again.");
      setReasonBtn("Continue");
    } else if (networkReason === "End"){
      setReason("Unable to close the game. Please try again.");
      setReasonBtn("Retry");
    } else if (networkReason === "Joining"){
      setReason("Unable to join the game. Please try again.");
      setReasonBtn("Continue");
    } else if (networkReason === "Create"){
      setReason("Unable to invite other player to the game. Please try again.");
      setReasonBtn("Continue");
    }
  },[networkReason]);

  

  return (
      <Modal open={open}>
        <Box sx={style}>
            <div class="modal-content">
                <img class="modal-logo" src={exclamation}></img>
                <h3>Network Connection Error</h3>
                <h3>{reason}</h3>
                <div>
                    <FillButton onClick={handleContinue} variant="contained">{reasonBtn}</FillButton>
                </div> 
            </div>
        </Box>
      </Modal>
  );
}