import "./App.css";
import {useState, useEffect} from "react";

import king_logo_white from "./Images/King Logo White.svg";
import bell from "./Images/Bell.svg";
import flag from "./Images/Flag.svg";

import SignUpModal from "./components/SignUpModal";
import LogInModal from "./components/LogInModal";
import DashboardCard from "./components/DashboardCard";
import HomeCard from "./components/HomeCard"
import AlertDialog from "./components/AlertDialog"

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase';
import { signOut } from "firebase/auth";
import { query, onSnapshot, orderBy, getDocs, collection, where, doc } from "firebase/firestore";  
import socket from "./socket";


const FillButton = styled(Button)(({ theme }) => ({
    color: '#000000',
    width: '15vw',
    backgroundColor: '#FFCD05',
    borderColor: '#FFCD05',
    borderRadius: '26px',
    '&:hover': {
      backgroundColor: '#B78B02',
      borderColor: '#B78B02',
    },
}));

const HollowButton = styled(Button)(({ theme }) => ({
    color: '#FFCD05',
    width: '15vw',
    borderColor: '#FFCD05',
    borderWidth: '4px',
    borderRadius: '26px',
    '&:hover': {
      /*backgroundColor: '#FFF9CD',*/
      color: '#B78B02',
      borderColor: '#B78B02',
      borderWidth: '4px',
    },
}));



export default function App() {
  
  const [alert, setAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertContent, setAlertContent] = useState('');

  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLogInOpen] = useState(false);

  const [SignUpCSS, setSignUpCSS] = useState('showNavButton');
  const [LogInCSS, setLogInCSS] = useState('showNavButton');
  const [LogOutCSS, setLogOutCSS] = useState('hideNavButton');
  const [BadgeCSS, setBadgeCSS] = useState('notification showNavButton');
  const [FlagCSS, setFlagCSS] = useState('end-game-flag hideNavButton');

  const [leaders, setLeaders] = useState([]);

  const [playFrields, SetPlayFrields] = useState(false);
  const [activeUser, SetActiveUser] = useState(false);
  
  const [playerId, setPlayerId] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUID] = useState('');
  const [win, setWin] = useState('');
  const [loss, setLoss] = useState('');
  
  const [invites, setInvites] = useState([]);
  const [inviteBadge, setInviteBadge] = useState(0);
  const [inviteBadgeClick, setInviteBadgeClick] = useState(false);

  const [forfeitOpen, setForfeitOpen] = useState(false);
  const [room, setRoom] = useState("");
  const [triggerHome, setTriggerHome] = useState(false);

  const fetchLeaderboard = async () => {
      var leadersCopy = [];
      const q = query(collection(db, "leaderboard"), orderBy("place"));
      onSnapshot(q, (snapshot) => {
        leadersCopy = snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
        }))

        setLeaders(leadersCopy);

      })
  }

  
  useEffect(() =>{
    //setLeaders(leaders => []);
    fetchLeaderboard();
    //console.log(leaders);
  },[leaders])

  useEffect(() =>{
    //setInvites(invites => []);
    fetchInvites();
    //console.log("Active Invites",invites);
  },[invites])
  

  useEffect(() =>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //const uid = user.uid;
        setUID(user.uid);
        console.log("uid",uid);
        fetchUserInfo();
        //fetchInvites();
        //console.log(invites);
        SetActiveUser(true);
        //console.log("User Signed In with uid",uid);
        setSignUpCSS('hideNavButton');
        setLogInCSS('hideNavButton');
        setLogOutCSS('showNavButton');
        
      } else {
        console.log("user is logged out")
        setSignUpCSS('showNavButton');
        setLogInCSS('showNavButton');
        setLogOutCSS('hideNavButton');
        SetActiveUser(false);
        
      }
    });
    
  },[activeUser])

  const handleSoccetUser = () => {
    socket.emit("username", username);
  }

  const fetchUserInfo = async () => {
    if (username == ''){

      const q = query(collection(db, "users"), where("uid", "==", uid));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          setPlayerId(doc.data().playerID);
          setUserId(doc.id);
          setUserName(doc.data().username);
          setEmail(doc.data().email);
          setWin(doc.data().win);
          setLoss(doc.data().loss)
          console.log("here",playerId,userId,username,email,win,loss);

      });
    }
  }

  const fetchInvites = async () => {

    var invitesCopy = [];

    if (userId != ''){
      const userCollection = collection(db, 'users');
      const DocRef = doc(userCollection, userId);
      const inviteCollection = collection(DocRef,'invites');
      const q = query(inviteCollection);
      onSnapshot(q, (snapshot) => {
        const count = snapshot.size;
        if (snapshot.empty){
          setInviteBadge(count);
          setInvites(invitesCopy);
          return
        } else{

          invitesCopy = snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
          }))

          setInviteBadge(count);
          setInvites(invitesCopy);
          
        }
        
      })
    } 

    /*
    if (userId != ''){
      const userCollection = collection(db, 'users');
      const DocRef = doc(userCollection, userId);
      const inviteCollection = collection(DocRef,'invites');
      var count = 0;
      const q = query(inviteCollection);
      onSnapshot(q, (snapshot) => {
        if (snapshot.empty){
          setInviteBadge(count)
          return
        }
        else{
          setInvites(snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
          })))
          count = count + 1;
          setInviteBadge(count)
        }
        
      })
    } */
  }

  const handleLogout = () => {               
    signOut(auth).then(() => {
        // Sign-out successful.
        
        setAlertSeverity('success'); 
        setAlertContent('Successfully signed out!');
        setAlert(true); 

        if (playFrields == true){
          SetPlayFrields(false);
        }
        
        console.log("Signed out successfully")
    }).catch((error) => {
        // An error happened.
    });
  }
  
  const handleBadge = () => {
    console.log("badge click");

    if (activeUser == false) {
      //prompt to sign in
      setLogInOpen(true);
    } else {
      //send to dashboard
      setInviteBadgeClick(true);
      SetPlayFrields(true);
      
    }
  }

  const handleFlag = () => {
    //prompt user to end game
    setForfeitOpen(true);
  }

  const handleHome = () => { 
    if (room != "") {
      setTriggerHome(true);
      setForfeitOpen(true);
    } else {
      SetPlayFrields(false);
    }              
  }
  
  useEffect(() => {
    handleSoccetUser();
  }, [username]);

  return (
    <body>
      
      <section class="header">
        <nav>
          <div class="nav-image">
            
            <img class="king-logo" onClick={handleHome} src={king_logo_white}></img>

          </div>

          <ul class="nav-links">
            <div class="menu">
              <li class={SignUpCSS}><Box display="flex" sx={{ height: '52px'}}><FillButton onClick={() => {setSignUpOpen(true)}} variant="outlined">Sign Up</FillButton></Box></li>
              <li class={LogInCSS}><Box display="flex" sx={{ height: '52px' }}><HollowButton onClick={() => {setLogInOpen(true)}} variant="outlined">Log In</HollowButton></Box></li>
              <li class={LogOutCSS}><Box display="flex" sx={{ height: '52px' }}><HollowButton onClick={handleLogout} variant="outlined">Log Out</HollowButton></Box></li>
              <li><Badge onClick={handleBadge} badgeContent={inviteBadge} color="primary"><img class={BadgeCSS} src={bell}></img></Badge></li>
              <li><img onClick={handleFlag} class={FlagCSS} src={flag}></img></li>
            </div>
          </ul>
        </nav>
      </section>
      
      {playFrields? <DashboardCard SetPlayFrields={SetPlayFrields} setTriggerHome={setTriggerHome} triggerHome={triggerHome} room={room} setRoom={setRoom} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} forfeitOpen={forfeitOpen} setForfeitOpen={setForfeitOpen} inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} username={username} userId={userId} playerId={playerId} invites={invites} win={win} loss={loss}></DashboardCard> : <HomeCard handlePlayFriends={() => {
          if (activeUser == false) {
            //prompt to sign in
            setLogInOpen(true);
          } else {
            //send to dashboard
            SetPlayFrields(true);
            fetchInvites();
          }
        }} leaders={leaders}></HomeCard>}
      
      <SignUpModal 
        open={signUpOpen}
        handleSignUp={() => {
          setSignUpOpen(false);
        }}
        openLogIn={() => {
          setSignUpOpen(false);
          setLogInOpen(true);
        }}
      ></SignUpModal>

      <LogInModal 
        open={loginOpen}
        handleLogIn={() => {
          setLogInOpen(false);
        }}
        openSignUp={() => {
          setLogInOpen(false);
          setSignUpOpen(true);
        }}
      ></LogInModal>

      {alert ? <AlertDialog severity={alertSeverity} contentText={alertContent} handleClose={() => {setAlert(false)}}></AlertDialog> : <></>}
      
    </body>
  );
}