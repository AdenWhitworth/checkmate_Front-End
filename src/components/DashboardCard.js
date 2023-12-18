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

  const [playerTurn, setPlayerTurn] = useState("w"); //use for player turn
  const [history, setHistory] = useState([]);//object of game history
  const [opponentUserName, setOpponentUserName] = useState("");//use for opponent username
  const [opponentUserId, setOpponentUserId] = useState("");//use for opponent user id
  const [opponentPlayerId, setOpponentPlayerId] = useState("");//use for opponent player id
  const [opponentWin, setOpponentWin] = useState("");//use for opponent win
  const [opponentLoss, setOpponentLoss] = useState("");//use for opponent loss
  const [opponentInviteId, setOpponentInviteId] = useState("");//use for opponent invite id
  const [orientation, setOrientation] = useState("");//use for board orientation for current player
  const [gameplayers, setGamePlayers] = useState([]);//array of players in active game
  const [forfeitGame, setForfeitGame] = useState(false);//use for when current player forfeits game

  useEffect(() => {
    //listen to join room socket for oppenent joining the game
    handleSoccetOpponentJoinRoom();
  }, []);

  useEffect(() => {
    //give current player the ability to either see invites, exit game, or end game
    //when no invite is sent then there is no active room. Show only notification
    //when invite is sent but the opponent has not joined. Show exit game
    //when both players are in the room. show end game
    if (room != ""){
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
    //attach socket for opponent joining room
    socket.on("opponentJoined", (roomData) => {
      setGamePlayers(roomData.players);
    });
  }

  //if current player selects to go home send them there
  const checkSendHome = () => {
    if (triggerHome == true){
      setTriggerHome(false);
      SetPlayFrields(false);
    }
  }

  useEffect(() => {
    //when exit button is clicked return the user to invites screen and delete active invite to opponent
    if (triggerExit == true){
      handleExit();
    }
  }, [triggerExit]);

  //delete active invite sent to opponent triggered when current player exits the game
  const handleExit = () => {
    
    setTriggerExit(false);

    const userCollection = collection(db, 'users');
    const DocRef = doc(userCollection, opponentUserId);
    const inviteCollection = collection(DocRef,'invites');
    const DocRef2 = doc(inviteCollection, opponentInviteId);
    deleteDoc(DocRef2);

    cleanup();
    
  }

  useEffect(() => {

    //when current player refreshes the page check to see if an active invite is pending
    const onUnload = () => {

      //when there is a room created and one player in it then there is an invite pending
      //before page refreshes delete pending invite
      if (room != "" && gameplayers.length == 0){
          handleExit();
      }
    };

    window.addEventListener("unload", onUnload);

    return () => {
      window.removeEventListener("unload", onUnload);
    };
  }, [opponentInviteId,opponentUserId]);

  const cleanup = useCallback(() => {
    //reset the board and game data
    setRoom("");
    setOrientation("");
    setGamePlayers("");
  }, []);

    return (
      <GameContext.Provider value={{setOpponentInviteId, playerTurn, setPlayerTurn, history, setHistory, opponentUserName, setOpponentUserName, opponentUserId, setOpponentUserId, opponentPlayerId, setOpponentPlayerId, opponentWin, setOpponentWin, opponentLoss, setOpponentLoss}}>
        <section class="dashboard">
          <div class="dashboard-content">

            <ActiveGame win={win} loss={loss} userId={userId} opponentUserName={opponentUserName} checkSendHome={checkSendHome} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} forfeitGame={forfeitGame} room={room} orientation={orientation} username={username} gameplayers={gameplayers} cleanup={cleanup}></ActiveGame>
            
            {room? <GameCard win={win} loss={loss} orientation={orientation} username={username} gameplayers={gameplayers}></GameCard> : <InfoCard inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} win={win} loss={loss} playerId={playerId} userId={userId} username={username} invites={invites} setRoom={setRoom} setOrientation={setOrientation} setGamePlayers={setGamePlayers}></InfoCard>}
            
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