import GameCard from "../components/GameCard";
import InfoCard from "../components/InfoCard";
import ActiveGame from "../ActiveGame";
import { useState, useCallback, useEffect, createContext } from "react";
import socket from "../socket";
import EndGameDialog from "../components/EndGameDialog";
import { db } from '../firebase';
import { collection, deleteDoc, doc} from "firebase/firestore";

export const GameContext = createContext();

export default function DashboardCard({setTriggerExit, triggerExit, setExitCSS, playerId, userId, username, invites, win, loss, inviteBadgeClick, setInviteBadgeClick, setFlagCSS, setForfeitOpen, forfeitOpen, setBadgeCSS, room, setRoom, triggerHome, setTriggerHome,SetPlayFrields}) {

  const [playerTurn, setPlayerTurn] = useState("w");
  const [history, setHistory] = useState([]);

  const [opponentUserName, setOpponentUserName] = useState("");
  const [opponentUserId, setOpponentUserId] = useState("");
  const [opponentPlayerId, setOpponentPlayerId] = useState("");
  const [opponentWin, setOpponentWin] = useState("");
  const [opponentLoss, setOpponentLoss] = useState("");
  const [opponentInviteId, setOpponentInviteId] = useState("");

  //const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [gameplayers, setGamePlayers] = useState([]);
  const [forfeitGame, setForfeitGame] = useState(false);

  useEffect(() => {
    handleSoccetOpponentJoinRoom();
  }, []);

  useEffect(() => {
    if (room != ""){
      console.log(gameplayers.length);
      if (gameplayers.length == 0){
        setBadgeCSS('notification hideNavButton');
        setFlagCSS('end-game-flag hideNavButton');
        setExitCSS('exit-arrow showNavButton');
      } else {
        setBadgeCSS('notification hideNavButton');
        setFlagCSS('end-game-flag showNavButton');
        setExitCSS('exit-arrow hideNavButton');
      }
    }
    else {
      setBadgeCSS('notification showNavButton');
      setFlagCSS('end-game-flag hideNavButton');
      setExitCSS('exit-arrow hideNavButton');
    }
    
  }, [room, gameplayers]);


  const handleSoccetOpponentJoinRoom = () => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setGamePlayers(roomData.players);
    });
  }

  const checkSendHome = () => {
    if (triggerHome == true){
      setTriggerHome(false);
      SetPlayFrields(false);
    }
  }

  useEffect(() => {
    //when exit button is clicked
    if (triggerExit == true){
      handleExit();
    }
  }, [triggerExit]);

  const handleExit = () => {
    console.log("handle exit",opponentUserId,opponentInviteId);
    
    setTriggerExit(false);

    const userCollection = collection(db, 'users');
    const DocRef = doc(userCollection, opponentUserId);
    const inviteCollection = collection(DocRef,'invites');
    const DocRef2 = doc(inviteCollection, opponentInviteId);
    deleteDoc(DocRef2);

    cleanup();
    
  }

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      // Execute your function here
      if (gameplayers.length == 0){
        handleExit();
      }
    });
  
    return () => {
      window.removeEventListener('beforeunload', (event) => {
        // Remove the event listener here
      });
    };
  }, []);

  const cleanup = useCallback(() => {
    console.log("clean room");
    setRoom("");
    setOrientation("");
    setGamePlayers("");
  }, []);

    return (
      <GameContext.Provider value={{setOpponentInviteId, playerTurn, setPlayerTurn, history, setHistory, opponentUserName, setOpponentUserName, opponentUserId, setOpponentUserId, opponentPlayerId, setOpponentPlayerId, opponentWin, setOpponentWin, opponentLoss, setOpponentLoss}}>
        <section class="dashboard">
          <div class="dashboard-content">

            <ActiveGame win={win} loss={loss} userId={userId} opponentUserName={opponentUserName} checkSendHome={checkSendHome} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} forfeitGame={forfeitGame} room={room} orientation={orientation} username={username} gameplayers={gameplayers} cleanup={cleanup}></ActiveGame>
            
            {room? <GameCard win={win} loss={loss} orientation={orientation} playerId={playerId} userId={userId} username={username} gameplayers={gameplayers}></GameCard> : <InfoCard inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} win={win} loss={loss} playerId={playerId} userId={userId} username={username} invites={invites} setRoom={setRoom} setOrientation={setOrientation} setGamePlayers={setGamePlayers}></InfoCard>}
            
            <EndGameDialog 
              open={forfeitOpen} 
              opponentUserName={opponentUserName}
              handleForfeit={() => {
                setForfeitOpen(false);
                if (triggerHome == true){
                  setTriggerHome(false);
                }
              }}
              handleEndGame={() =>{
                setForfeitOpen(false);
                setForfeitGame(true);
                setFlagCSS('end-game-flag hideNavButton');
                setBadgeCSS('notification showNavButton');
              }}
            ></EndGameDialog>

          </div>
        </section>
        </GameContext.Provider>
    );
}