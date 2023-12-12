import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import closeX from "../Images/close.svg"
import "../App.css";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import king_logo_black from "../Images/King Logo Black.svg";

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
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: '0',
    borderRadius: 5,
};

export default function EndGameDialog({ open, opponentUserName, handleForfeit, handleEndGame}) {
    return (
        <Modal open={open}>
            <Box sx={style}>
                <div class="modal-content">
                    <img onClick={handleForfeit} class="modal-close" src={closeX}></img>
                    <img class="modal-logo" src={king_logo_black}></img>
                    <h3>Forfeit current game against {opponentUserName}?</h3>
                    <div>
                        <FillButton onClick={handleEndGame} variant="outlined">End Game</FillButton>
                    </div>
                </div>
            </Box>
        </Modal>
    
    );
}