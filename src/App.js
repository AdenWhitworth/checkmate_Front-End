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
  
  //Initialize parent states to be used by child components
  const [alert, setAlert] = useState(false); //use to open alert dialog
  const [alertSeverity, setAlertSeverity] = useState(''); //use to determine alert dialog severity for styling
  const [alertContent, setAlertContent] = useState(''); //text to be used within the alert
  const [signUpOpen, setSignUpOpen] = useState(false);//use to open sign up modal
  const [loginOpen, setLogInOpen] = useState(false);//use to open login modal
  const [SignUpCSS, setSignUpCSS] = useState('showNavButton');//CSS styling for sign up navigation button
  const [LogInCSS, setLogInCSS] = useState('showNavButton');//CSS styling for log in navigation button
  const [LogOutCSS, setLogOutCSS] = useState('hideNavButton');//CSS styling for log out navigation button
  const [BadgeCSS, setBadgeCSS] = useState('notification showNavButton');//CSS styling for notification badge navigation button
  const [FlagCSS, setFlagCSS] = useState('end-game-flag hideNavButton');//CSS styling for forfeit flag navigation button
  const [MobileCSS, setMobileCSS] = useState('nav-links nav-hide');//CSS styling for for mobile responsive design
  const [ExitCSS, setExitCSS] = useState('exit-arrow hideNavButton');//CSS styling for exit game navigation button
  const [leaders, setLeaders] = useState([]);//object for leaderboard
  const [playFrields, SetPlayFrields] = useState(false);//use to show HomeCard or Dashboard Card
  const [activeUser, SetActiveUser] = useState(false);//use to track if user is signed in
  const [playerId, setPlayerId] = useState('');//use to store database player id
  const [userId, setUserId] = useState('');//use to store database user id
  const [username, setUserName] = useState('');//use to store database username
  const [uid, setUID] = useState('');//use to store database auth uid
  const [win, setWin] = useState('');//use to store database win
  const [loss, setLoss] = useState('');//use to store database loss
  const [invites, setInvites] = useState([]);//object for invites list
  const [inviteBadge, setInviteBadge] = useState(0);//use to track number of invites for badge
  const [inviteBadgeClick, setInviteBadgeClick] = useState(false);//use to direct player to invites list
  const [forfeitOpen, setForfeitOpen] = useState(false);//use to promp forfeit of the game
  const [room, setRoom] = useState("");//use to store database & socket room name
  const [triggerHome, setTriggerHome] = useState(false);//use to direct player to home
  const [triggerExit, setTriggerExit] = useState(false);//use to prompt when player is exit game before opponent joins
  const [token, setToken] = useState('');//use to track firebase auth token
  const [socket, setSocket] = useState(null);//use to track socket instance 
  const [networkError, setNetworkError] = useState(false);//use for tracking error state from back-end
  const [networkReason, setNetworkReason] = useState('');// use for tracking error message from back-end

  //Function to check the top 10 leaders based on weighted rank stored in Firestore
  const fetchLeaderboard = async () => {
      var leadersCopy = [];//create an empty object to fill with new query
      const q = query(collection(db, "users"), orderBy("rank","desc"), limit(10));
      onSnapshot(q, (snapshot) => {
        //map through leaders and store in new empty object
        leadersCopy = snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
        }))

        //trigger a rerender of the leaderboard
        setLeaders(leadersCopy);

      })
  }

  
  useEffect(() =>{
    //refresh leadboard on re-render
    fetchLeaderboard();
  },[leaders])

  useEffect(() =>{
    //refresh invites on re-render
    fetchInvites();
  },[room])

  useEffect(() =>{
    //check for user being signed in or sign out
    //re-initialize with each re-render
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        //get user info from database
        //change navigation to only show log out button

        setToken(user.accessToken);//set firebase token 
        setUID(user.uid);//set firebase auth uid
        fetchUserInfo();//fetch user info from database
        SetActiveUser(true);
        setSignUpCSS('hideNavButton');
        setLogInCSS('hideNavButton');
        setLogOutCSS('showNavButton');
        
      } else {
        //change navigation to prompt user to sign up or log in
        setSignUpCSS('showNavButton');
        setLogInCSS('showNavButton');
        setLogOutCSS('hideNavButton');
        SetActiveUser(false);
        
      }
    });
    
  },[activeUser])

  //use this to get either an existing or new firebase token
  const fetchAuthProfile = () => {
    auth.currentUser.getIdToken().then(function(idToken){
      setToken(idToken);//set firebase token
    }). catch (function(error) {//if the token is not fetched then sign the user out to restart the process
      setSocket(null);//reset the socket
      handleLogout();//sign out the user
    })

  }

  //function to set up initial socket connection 
  //This allows for us to retry connection if their is an error
  const setupSocket = () => {
    if (token !== ''){//make sure there is a token
      try{//try to setup a connection
        const newSocket = io('https://online-chess-with-friends-server.glitch.me',{ //for local testing use localhost:8080
          auth: {
              token: token
          }
        });
  
        setSocket(newSocket); //set socket to be used by later methods 

      } catch (error){//try issuing a new token to connect again. If this doesnt work then the user will be signed out
        fetchAuthProfile();
      }
      
    }
  }

  //This socket method is called if the authentication fails
  useEffect(() => {
    if (socket !== null){//need to ensure that a socket has been established even if not authenticated
      
      socket.on("connect_error", (err) => {//try issuing a new token to connect again. If this doesnt work then the user will be signed out
        fetchAuthProfile();
      });
      
    }
  },[socket]);

  //this allows for the initail socket to be created on first load and subsequent connections to be made if the token is changed
  useEffect(() => {
    setupSocket();
  },[token]);

  const handleSoccetUser = () => {
    //emit the current player username so back end can keep track of players
    socket.emit("username", username, (response) => {//emit username and set a response callback
      //if the username is not set in the server prompt the user to try connecting again 
      if (response.error){
        setNetworkError(true);
        setNetworkReason("Username");
      }
    });
  }

  useEffect(() => {
    if (socket !== null && username !== ""){
      //when a user is signed in and socket is established emit the username to socket 
      handleSoccetUser();
    }
    
  }, [socket,username]);

  const fetchUserInfo = async () => {

    //Do not re-query database if a user is currently signed in
    if (username == ''){

      //query the database for current user based on auth uid from sign up/log in
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

    //create an empty object to fill with new query
    var invitesCopy = [];

    //only fetch invites if a player is signed in
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
          //map through invites and set to new empty object
          invitesCopy = snapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
          }))

          //refresh notification badge count and invites list
          setInviteBadge(count);
          setInvites(invitesCopy);
          
        }
        
      })
    } 
  }

  const handleLogout = () => {     
    //when called sign the user out          
    signOut(auth).then(() => {
        //Alert the user of successful sign out
        setAlertSeverity('success'); 
        setAlertContent('Successfully signed out!');
        setAlert(true); 

        //return the current user to home screen if not there currently
        if (playFrields == true){
          SetPlayFrields(false);
        }
        
    }).catch((error) => {
        //Alert user of error signing out
        setAlertSeverity('error'); 
        setAlertContent('Error signing out! Try again.');
        setAlert(true); 
    });
  }
  
  const handleBadge = () => {
    //handle when the notification badge is clicked 
    //if a user is not signed in then prompt them to sign in
    if (activeUser == false) {
      //prompt to sign in
      setLogInOpen(true);
    } else {
      //send to dashboard invites list
      setInviteBadgeClick(true);
      SetPlayFrields(true);
      
    }
  }

  const handleFlag = () => {
    //prompt user to end game
    setForfeitOpen(true);
  }

  const handleHome = () => { 
    //prompt user to return home
    //if in a current game prompt the current user to forfeit the game
    if (room != "") {
      setTriggerHome(true);
      setForfeitOpen(true);
    } else {
      SetPlayFrields(false);
    }              
  }

  const showMenu = () => {
    //show the mobile navigation menue when clicked
    setMobileCSS('nav-links nav-show');
  }

  const closeMenu = () => {
    //hide the mobile navigation menue when clicked
    setMobileCSS('nav-links nav-hide');
  }

  const handleExit = () => {
    //when exit button is clicked allow for the invite to be cancelled
    //Exit button is for when current player invites opponent but opponent has not joined the game yet
    //alert the current user of successfully exiting the game
    setTriggerExit(true);
    setAlertSeverity('success'); 
    setAlertContent('Successfully Exited Game!');
    setAlert(true); 
  };

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
      
      {playFrields? <DashboardCard setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} setTriggerExit={setTriggerExit} triggerExit={triggerExit} SetPlayFrields={SetPlayFrields} setTriggerHome={setTriggerHome} triggerHome={triggerHome} room={room} setRoom={setRoom} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} setExitCSS={setExitCSS} forfeitOpen={forfeitOpen} setForfeitOpen={setForfeitOpen} inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} username={username} userId={userId} playerId={playerId} invites={invites} win={win} loss={loss}></DashboardCard> : <HomeCard handlePlayFriends={() => {
          //if user is not signed in prompt them top
          //this is triggered on play friends button
          //re-fetch invites to see if any new ones came in
          if (activeUser == false) {
            //prompt to sign in
            setLogInOpen(true);
          } else {
            //send to dashboard and refresh invites list
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

      

      <ConnectionDialog 
        open={networkError} 
        networkReason={networkReason}
        handleContinue={() => {
          //close the modal
          setNetworkError(false);

          //depending on the error reason retry what failed
          if (networkReason === "Username"){
            handleSoccetUser();//retry setting the username 
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

