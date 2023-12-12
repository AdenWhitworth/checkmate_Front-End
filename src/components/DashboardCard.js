import GameCard from "../components/GameCard";
import InfoCard from "../components/InfoCard";
import ActiveGame from "../ActiveGame";
import { useState, useCallback, useEffect, createContext } from "react";
import socket from "../socket";
import EndGameDialog from "../components/EndGameDialog";

export const GameContext = createContext();

export default function DashboardCard({playerId, userId, username, invites, win, loss, inviteBadgeClick, setInviteBadgeClick, setFlagCSS, setForfeitOpen, forfeitOpen, setBadgeCSS, room, setRoom, triggerHome, setTriggerHome,SetPlayFrields}) {

  const [playerTurn, setPlayerTurn] = useState("w");
  const [history, setHistory] = useState([]);

  const [opponentUserName, setOpponentUserName] = useState("");
  const [opponentUserId, setOpponentUserId] = useState("");
  const [opponentPlayerId, setOpponentPlayerId] = useState("");
  const [opponentWin, setOpponentWin] = useState("");
  const [opponentLoss, setOpponentLoss] = useState("");

  //const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [gameplayers, setGamePlayers] = useState([]);
  const [forfeitGame, setForfeitGame] = useState(false);

  useEffect(() => {
    handleSoccetOpponentJoinRoom();
  }, []);

  useEffect(() => {
    if (room != ""){
      setBadgeCSS('notification hideNavButton');
      setFlagCSS('end-game-flag showNavButton');
    }
    
  }, [room]);


  const handleSoccetOpponentJoinRoom = () => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setGamePlayers(roomData.players);
    });
  }

  const checkSendHome = () => {
    if (triggerHome == true){
      setTriggerHome(false);
      SetPlayFrields(false);
    }
  }

  const cleanup = useCallback(() => {
    console.log("clean room");
    setRoom("");
    setOrientation("");
    setGamePlayers("");
  }, []);

    return (
      <GameContext.Provider value={{playerTurn, setPlayerTurn, history, setHistory, opponentUserName, setOpponentUserName, opponentUserId, setOpponentUserId, opponentPlayerId, setOpponentPlayerId, opponentWin, setOpponentWin, opponentLoss, setOpponentLoss}}>
        <section class="dashboard">
          <div class="dashboard-content">

            <ActiveGame opponentUserName={opponentUserName} checkSendHome={checkSendHome} setBadgeCSS={setBadgeCSS} setFlagCSS={setFlagCSS} forfeitGame={forfeitGame} room={room} orientation={orientation} username={username} gameplayers={gameplayers} cleanup={cleanup}></ActiveGame>
            
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