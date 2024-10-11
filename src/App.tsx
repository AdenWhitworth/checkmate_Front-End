/*
import "./App.css";
import {useState, useEffect} from "react";
import king_logo_white from "./Images/King Logo White.svg";
import bell from "./Images/Bell.svg";
import flag from "./Images/Flag.svg";
import bars from "./Images/bars-solid.svg";
import arrow_left from "./Images/Arrow Left.svg";
import close_white from "./Images/close white.svg";
import SignUpModal from "./components/SignUpModal";
import LogInModal from "./components/LogInModal";
import DashboardCard from "./components/DashboardCard";
import HomeCard from "./components/HomeCard"
import AlertDialog from "./components/AlertDialog"
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { query, onSnapshot, orderBy, getDocs, collection, where, doc, limit } from "firebase/firestore";  
import { io } from "socket.io-client";
import ConnectionDialog from "./components/ConnectionDialog";

const FillButton = styled(Button)(({ theme }) => ({
    color: '#000000',
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
    borderColor: '#FFCD05',
    borderWidth: '4px',
    borderRadius: '26px',
    '&:hover': {
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
  const [MobileCSS, setMobileCSS] = useState('nav-links nav-hide');
  const [ExitCSS, setExitCSS] = useState('exit-arrow hideNavButton');
  const [leaders, setLeaders] = useState([]);
  const [playFrields, SetPlayFrields] = useState(false);
  const [activeUser, SetActiveUser] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUserName] = useState('');
  const [uid, setUID] = useState('');
  const [win, setWin] = useState('');
  const [loss, setLoss] = useState('');
  const [invites, setInvites] = useState([]);
  const [inviteBadge, setInviteBadge] = useState(0);
  const [inviteBadgeClick, setInviteBadgeClick] = useState(false);
  const [forfeitOpen, setForfeitOpen] = useState(false);
  const [room, setRoom] = useState("");
  const [triggerHome, setTriggerHome] = useState(false);
  const [triggerExit, setTriggerExit] = useState(false);
  const [token, setToken] = useState('');
  const [socket, setSocket] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [networkReason, setNetworkReason] = useState('');

  const fetchLeaderboard = async () => {
      var leadersCopy = [];
      const q = query(collection(db, "users"), orderBy("rank","desc"), limit(10));
      onSnapshot(q, (snapshot) => {
        leadersCopy = snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
        }))

        setLeaders(leadersCopy);

      })
  }

  const handleAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {

        setToken(user.accessToken);
        setUID(user.uid);
        fetchUserInfo();
        SetActiveUser(true);
        setSignUpCSS('hideNavButton');
        setLogInCSS('hideNavButton');
        setLogOutCSS('showNavButton');
        
      } else {
        
        setSignUpCSS('showNavButton');
        setLogInCSS('showNavButton');
        setLogOutCSS('hideNavButton');
        SetActiveUser(false);
        
      }
    });
  }

  const fetchAuthProfile = () => {
    auth.currentUser.getIdToken().then(function(idToken){
      setToken(idToken);
    }). catch (function(error) {
      setSocket(null);
      handleLogout();
    })

  }

  const setupSocket = () => {
    if (token !== ''){
      try{
        const newSocket = io('https://online-chess-with-friends-server.glitch.me',{ //for local testing use localhost:8080
          auth: {
              token: token
          }
        });
  
        setSocket(newSocket);

      } catch (error){
        fetchAuthProfile();
      }
      
    }
  }

  const handleSoccetConnectionError = () => {
    if (socket !== null){
      socket.on("connect_error", (err) => {
        fetchAuthProfile();
      });
    }
  }

  const handleSoccetUser = () => {
    socket.emit("username", username, (response) => {
      if (response.error){
        setNetworkError(true);
        setNetworkReason("Username");
      }
    });
  }

  const fetchUserInfo = async () => {
    if (username == ''){
      const q = query(collection(db, "users"), where("uid", "==", uid));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          setPlayerId(doc.data().playerID);
          setUserId(doc.id);
          setUserName(doc.data().username);
          setWin(doc.data().win);
          setLoss(doc.data().loss)
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
          //empty snapshot means 0 invites
          //update badge to show no invites
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
  }

  const handleLogout = () => {     
             
    signOut(auth).then(() => {
        setAlertSeverity('success'); 
        setAlertContent('Successfully signed out!');
        setAlert(true); 

        if (playFrields == true){
          SetPlayFrields(false);
        }
        
    }).catch((error) => {
        setAlertSeverity('error'); 
        setAlertContent('Error signing out! Try again.');
        setAlert(true); 
    });
  }
  
  const handleBadge = () => {
    if (activeUser == false) {
      setLogInOpen(true);
    } else {
      setInviteBadgeClick(true);
      SetPlayFrields(true);
    }
  }

  const handleFlag = () => {
    setForfeitOpen(true);
  }

  const handleHome = () => { 
    //if in a current game prompt the current user to forfeit the game
    if (room != "") {
      setTriggerHome(true);
      setForfeitOpen(true);
    } else {
      SetPlayFrields(false);
    }              
  }

  const showMenu = () => {
    setMobileCSS('nav-links nav-show');
  }

  const closeMenu = () => {
    setMobileCSS('nav-links nav-hide');
  }

  const handleExit = () => {
    setTriggerExit(true);
    setAlertSeverity('success'); 
    setAlertContent('Successfully Exited Game!');
    setAlert(true); 
  };

  const handlePlayFriends = () => {
    if (activeUser == false) {
      //prompt to sign in
      setLogInOpen(true);
    } else {
      //send to dashboard and refresh invites list
      SetPlayFrields(true);
      fetchInvites();
    }
  }

  useEffect(() =>{
    fetchLeaderboard();
  },[leaders])

  useEffect(() =>{
    fetchInvites();
  },[room])

  useEffect(() =>{
    handleAuthState();
  },[activeUser])

  useEffect(() => {
    handleSoccetConnectionError();
  },[socket]);

  useEffect(() => {
    setupSocket();
  },[token]);

  useEffect(() => {
    if (socket !== null && username !== ""){
      handleSoccetUser();
    }
  }, [socket,username]);

  return (
    
    <div class="Body">
      
      <section class="header">
        <nav>
          <div class="nav-image">
            
            <img class="king-logo" onClick={handleHome} src={king_logo_white}></img>

          </div>

          <ul class={MobileCSS}>
            <div class="menu">
              <li><img class="nav-close" onClick={closeMenu} src={close_white}></img></li>
              <li class={SignUpCSS}><Box display="flex" sx={{ height: '52px'}}><FillButton sx={{width:{xs: '85%',md: '15vw'}}} onClick={() => {setSignUpOpen(true)}} variant="outlined">Sign Up</FillButton></Box></li>
              <li class={LogInCSS}><Box display="flex" sx={{ height: '52px' }}><HollowButton sx={{width:{xs: '85%',md: '15vw'}}} onClick={() => {setLogInOpen(true)}} variant="outlined">Log In</HollowButton></Box></li>
              <li class={LogOutCSS}><Box display="flex" sx={{ height: '52px' }}><HollowButton sx={{width:{xs: '85%',md: '15vw'}}} onClick={handleLogout} variant="outlined">Log Out</HollowButton></Box></li>
              <li><Badge onClick={handleBadge} badgeContent={inviteBadge} color="primary"><img class={BadgeCSS} src={bell}></img></Badge></li>
              <li><img onClick={handleExit} class={ExitCSS} src={arrow_left}></img></li>
              <li><img onClick={handleFlag} class={FlagCSS} src={flag}></img></li>
            </div>
          </ul>

          <img class="nav-bars" onClick={showMenu} src={bars}></img>

        </nav>
      </section>
      
      {playFrields? <DashboardCard setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} setTriggerExit={setTriggerExit} triggerExit={triggerExit} SetPlayFrields={SetPlayFrields} setTriggerHome={setTriggerHome} triggerHome={triggerHome} room={room} setRoom={setRoom} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} setExitCSS={setExitCSS} forfeitOpen={forfeitOpen} setForfeitOpen={setForfeitOpen} inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} username={username} userId={userId} playerId={playerId} invites={invites} win={win} loss={loss}></DashboardCard> : <HomeCard handlePlayFriends={handlePlayFriends} leaders={leaders}></HomeCard>}
      
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

      <ConnectionDialog 
        open={networkError} 
        networkReason={networkReason}
        handleContinue={() => {
          setNetworkError(false);

          if (networkReason === "Username"){
            handleSoccetUser();
          } else if (networkReason === "End"){
            socket.emit("closeRoom", {roomId: room}, (response) => {
              if (response.error){//if there is an error closing the room, repeat the close action
                setNetworkError(true);
                setNetworkReason("End");
                return
              }
            });
          }

        }}
      ></ConnectionDialog>

      {alert ? <AlertDialog severity={alertSeverity} contentText={alertContent} handleClose={() => {setAlert(false)}}></AlertDialog> : <></>}
   
    </div>
  );
}

*/


import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import { AuthProvider } from './Providers/AuthProvider/AuthProvider';
import PrivateRoute from './Routes/PrivateRoute';

function App(): JSX.Element {

  return (
    <div className="App">  
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>
          <Route path='/auth' element={<></>}></Route>
          <Route path='/home' element={<PrivateRoute><h1>Home</h1></PrivateRoute>}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
