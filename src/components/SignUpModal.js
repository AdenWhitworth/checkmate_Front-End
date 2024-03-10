import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import king_logo_black from "../Images/King Logo Black.svg";
import user from "../Images/User.svg";
import key from "../Images/Key.svg";
import mail from "../Images/Mail.svg";
import closeX from "../Images/close.svg";
import "../App.css";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {useState, useEffect} from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { collection, addDoc, setDoc, doc, where, query, getDocs} from "firebase/firestore";

const FillButton = styled(Button)(({ theme }) => ({
    color: '#000000',
    borderColor: '#FFCD05',
    backgroundColor: '#FFCD05',
    width: "70%",
    borderRadius: '26px',
    '&:hover': {
      backgroundColor: '#B78B02',
      borderColor: '#B78B02',
    },
}));

const HollowButton = styled(Button)(({ theme }) => ({
    color: '#FFCD05',
    borderColor: '#FFCD05',
    width: "70%",
    borderRadius: '26px',
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

export default function SignUpModal({ open, handleSignUp, openLogIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [error, setError] = useState('');
    const [errorCSS, setErrorCSS] = useState('error-message error-hide');

    const onSubmit = async (e) => {
      e.preventDefault()

      //query current player usernames to make sure new username isnt taken
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.size == 0){
        
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setErrorCSS('error-message error-hide');
            const user = userCredential.user;
            SaveNewUser(user.uid);
            handleSignUp();
        })
        .catch((error) => {
            setError(error.code);
            setErrorCSS('error-message');
        });

      } else {
        setError('Username is taken');
        setErrorCSS('error-message');
      }

    }

    const SaveNewUser = async (uid) => {
        try {

            const docRef2 = doc(collection(db, "players"));

            const docRef = await addDoc(collection(db, "users"), {
              username: username,
              email: email,  
              uid: uid,
              playerID: docRef2.id,
              loss: 0,
              win: 0,
              rank: 0,
            });

            try {
                await setDoc(docRef2, {
                  username: username,
                  userID: docRef.id,    
                });
              } catch (e) {
                return
              }


          } catch (e) {
            return
          }
    }

    useEffect(() => {
        //reset the error message on each open of the modal
        setErrorCSS('error-message error-hide');
    }, [open]);

    return (
    <Modal open={open}>
        <Box sx={style}>
            <div class="modal-content">
                <img onClick={handleSignUp} class="modal-close" src={closeX}></img>
                <img class="modal-logo" src={king_logo_black}></img>
                <form onSubmit={onSubmit}>

                    <div class="input-text input-text-padding">
                        
                        <img class="input-img" src={user}></img>
                        <input onChange={(e) => setUserName(e.target.value)} required spellCheck="false" type="text" placeholder="Username"></input>
                    
                    </div>

                    <div class="input-text">
                        
                        <img class="input-img" src={mail}></img>
                        <input onChange={(e) => setEmail(e.target.value)} required spellCheck="false" type="email" placeholder="Email"></input>
                    
                    </div>

                    <div class="input-text">
                    
                        <img class="input-img" src={key}></img>
                        <input onChange={(e) => setPassword(e.target.value)} required spellCheck="false" type="password" placeholder="Password"></input>
                    
                    </div>

                    <div>
                        <FillButton type="submit" variant="contained">Sign Up</FillButton>
                    </div>

                    <h4 class={errorCSS} >{error}</h4>

                    <h4>or</h4>
                    <h3>Existing Player?</h3>

                    <div>
                        <HollowButton onClick={openLogIn} variant="outlined">Log In</HollowButton>
                    </div>
                </form>
            </div>
        </Box>
    </Modal>

  );

}

