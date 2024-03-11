import GameCard from "../components/GameCard";
import InfoCard from "../components/InfoCard";
import ActiveGame from "../ActiveGame";
import { useState, useCallback, useEffect, createContext} from "react";
import EndGameDialog from "../components/EndGameDialog";
import { db } from '../firebase';
import { collection, deleteDoc, doc} from "firebase/firestore";
import MessageDialog from "../components/MessageDialog";



export const GameContext = createContext();

export default function DashboardCard({setNetworkError, setNetworkReason, socket, setTriggerExit, triggerExit, setExitCSS, playerId, userId, username, invites, win, loss, inviteBadgeClick, setInviteBadgeClick, setFlagCSS, setForfeitOpen, forfeitOpen, setBadgeCSS, room, setRoom, triggerHome, setTriggerHome,SetPlayFrields}) {

  const [playerTurn, setPlayerTurn] = useState("w");
  const [history, setHistory] = useState([]);
  const [opponentUserName, setOpponentUserName] = useState("");
  const [opponentUserId, setOpponentUserId] = useState("");
  const [opponentPlayerId, setOpponentPlayerId] = useState("");
  const [opponentWin, setOpponentWin] = useState("");
  const [opponentLoss, setOpponentLoss] = useState("");
  const [opponentInviteId, setOpponentInviteId] = useState("");
  const [orientation, setOrientation] = useState("");
  const [gameplayers, setGamePlayers] = useState([]);
  const [forfeitGame, setForfeitGame] = useState(false);

  const inGameIconCSSHeaderToggle = () => {
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
  }

  const handleSoccetOpponentJoinRoom = () => {
    socket.on("opponentJoined", async (roomData, callback) => {
      let error, message;
      try{
        if (roomData.error === false){
          setGamePlayers(roomData.RoomUpdate.players);
        } else {
          error = true;
          message = "Error Emitting Opponent Joining";
          callback({error,message});
          return
        }

        error = false;
        message = "Success Emitting Opponent Joining";

        callback({error,message});

      } catch(e){
        error = true;
        message = e;

        callback({error,message});
      }
    });
  }

  const checkSendHome = () => {
    if (triggerHome == true){
      setTriggerHome(false);
      SetPlayFrields(false);
    }
  }

  const handleExit = () => {
    
    setTriggerExit(false);

    const userCollection = collection(db, 'users');
    const DocRef = doc(userCollection, opponentUserId);
    const inviteCollection = collection(DocRef,'invites');
    const DocRef2 = doc(inviteCollection, opponentInviteId);
    deleteDoc(DocRef2);

    cleanup();
  }

  const cleanup = useCallback(() => {
    //reset the board and game data
    setRoom("");
    setOrientation("");
    setGamePlayers("");
    setHistory([]);
  }, []);

  useEffect(() => {
    inGameIconCSSHeaderToggle();
  }, [room, gameplayers]);

  useEffect(() => {
    handleSoccetOpponentJoinRoom();
  }, []);

  useEffect(() => {
    if (triggerExit == true){
      handleExit();
    }
  }, [triggerExit]);

  useEffect(() => {
    const onUnload = () => {
      if (room != "" && gameplayers.length == 0){
          handleExit();
      }
    };

    window.addEventListener("unload", onUnload);

    return () => {
      window.removeEventListener("unload", onUnload);
    };
  }, [opponentInviteId,opponentUserId]);

    return (
      <GameContext.Provider value={{setOpponentInviteId, playerTurn, setPlayerTurn, history, setHistory, opponentUserName, setOpponentUserName, opponentUserId, setOpponentUserId, opponentPlayerId, setOpponentPlayerId, opponentWin, setOpponentWin, opponentLoss, setOpponentLoss}}>
        <section data-testid="DashboardCard-section" class="dashboard">
          <div class="dashboard-content">

            <ActiveGame setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} username={username} win={win} loss={loss} userId={userId} checkSendHome={checkSendHome} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} forfeitGame={forfeitGame} room={room} orientation={orientation} gameplayers={gameplayers} cleanup={cleanup}></ActiveGame>
            
            {room? <GameCard win={win} loss={loss} orientation={orientation} username={username} gameplayers={gameplayers}></GameCard> : <InfoCard setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} inviteBadgeClick={inviteBadgeClick} setInviteBadgeClick={setInviteBadgeClick} win={win} loss={loss} playerId={playerId} userId={userId} username={username} invites={invites} setRoom={setRoom} setOrientation={setOrientation} setGamePlayers={setGamePlayers}></InfoCard>}
            
            {room? <MessageDialog room={room} socket={socket} username={username}></MessageDialog> : <></>}

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