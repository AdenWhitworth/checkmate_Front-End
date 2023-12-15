import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import king_logo_black from "../Images/King Logo Black.svg";
import user from "../Images/User.svg";
import key from "../Images/Key.svg";
import mail from "../Images/Mail.svg";
import closeX from "../Images/close.svg"
import "../App.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import {useState} from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

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


    //creating a formData state to hold each state for email and password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [username, setUserName] = useState('');
    const [uid, setUID] = useState('');

    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setUID(user.uid);
            SaveNewUser();
            handleSignUp();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
 
   
    }

    const SaveNewUser = async (e) => {
        //e.preventDefault();  
       
        try {

            const docRef2 = doc(collection(db, "players"));

            const docRef = await addDoc(collection(db, "users"), {
              username: username,
              email: email,  
              uid: uid,
              playerID: docRef2.id,
              loss: 0,
              win: 0,
            });
            console.log("Document written with ID: ", docRef.id);

            try {
                await setDoc(docRef2, {
                  username: username,
                  userID: docRef.id,    
                });
                console.log("Document written with ID: ", docRef2.id);
              } catch (e) {
                console.error("Error adding document: ", e);
              }


          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

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
                    
                    {/*
                    <TextField
                        variant="outlined"
                        sx={{
                            width: '70%'
                        }}
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        margin="normal"
                        InputProps={{
                        startAdornment: (
                            <img src={user}></img>
                        ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        sx={{
                            width: '70%'
                        }}
                        margin="normal"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                        startAdornment: (
                            <img src={mail}></img>
                        ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        sx={{
                            width: '70%'
                        }}
                        placeholder="Password"
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                        startAdornment: (
                            <img src={key}></img>
                        ),
                        }}
                    />
                    */}

                    <div>
                        <FillButton type="submit" variant="contained">Sign Up</FillButton>
                    </div>

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

