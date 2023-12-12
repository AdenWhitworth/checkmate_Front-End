import "../App.css";
import globe from "../Images/Globe.svg";
import reply_arrow from "../Images/Reply Arrow.svg";
import Search from "../Images/Search.svg";
import PlayersItem from "./PlayersItem";
import InvitesItem from "./InvitesItem";
import { db } from '../firebase';
import { query, onSnapshot, collection, where } from "firebase/firestore";  
import {useState, useEffect} from "react";


export default function InfoCard({playerId, userId, username, invites, setRoom, setOrientation, setGamePlayers, room, win, loss, inviteBadgeClick, setInviteBadgeClick}) {

  const [selection, setSelection] = useState(false);
  const [playerStyle, setPlayerStyle] = useState("players-option info-selection");
  const [inviteStyle, setInviteStyle] = useState("invite-option info-unselection");
  const [players, setPlayers] = useState([]);
  const [searchPlayers, setSearchPlayers] = useState([]);
  const [searchInvites, setSearchInvites] = useState([]);
  

  const handleInfoSelection = () => {
    
    if (selection == false){
      setSelection(true);
      setPlayerStyle("players-option info-unselection");
      setInviteStyle("invite-option info-selection");
    } else{
      
      setSelection(false);
      setPlayerStyle("players-option info-selection");
      setInviteStyle("invite-option info-unselection");
    }
  }

  const fetchPlayers = async () => {
    var invitesUserIDs = [];
    Object.keys(invites).forEach(key=>{
      invitesUserIDs.push(invites[key].item.requestUserID);
    })

    invitesUserIDs.push(userId);
    var playersCopy = [];

    const q = query(collection(db, "players"), where("userID", 'not-in', invitesUserIDs));

    onSnapshot(q, (snapshot) => {

      //var size = snapshot.size;

      playersCopy = snapshot.docs.map(doc => ({
        id: doc.id,
        item: doc.data()
      }))

      setPlayers(playersCopy);
      
    })
      /*
      var index = 0
      var invitesUserIDs = [];
      Object.keys(invites).forEach(key=>{
        invitesUserIDs.push(invites[key].item.requestUserID);
      })

      invitesUserIDs.push(userId);
      var playersCopy = [];

      const q = query(collection(db, "players"), where("userID", 'not-in', invitesUserIDs));

      onSnapshot(q, (snapshot) => {

        setPlayers(snapshot.docs.map(doc => ({
          id: doc.id,
          item: doc.data()
        })))
        
      }) */

      
  }

  useEffect(() =>{
    //setPlayers(players => []);
    fetchPlayers();
    //console.log(players);
  },[players])

  useEffect(() =>{
    setSearchPlayers(players);
  },[players])

  useEffect(() =>{
    setSearchInvites(invites);
  },[invites])

  useEffect(() =>{
    if (inviteBadgeClick == true){
      handleInfoSelection();
      setInviteBadgeClick(false);
    }
  },[inviteBadgeClick])

  const filterPlayers = (e) => {
    const keyword = e.target.value;

    const playersCopy = [...players];
    if (keyword !=''){
      const searchResults = playersCopy.filter((player) => {
        return player.item.username.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearchPlayers(searchResults);
    } else {
      setSearchPlayers(playersCopy);
    }
    
  }

  const filterInvites = (e) => {
    const keyword = e.target.value;

    const invitesCopy = [...invites];

    if (keyword !=''){
      const searchResults = invitesCopy.filter((player) => {
        return player.item.requestUserName.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearchInvites(searchResults);
    } else {
      setSearchInvites(invitesCopy);
    }
    
  }

    return (
            <div class="info-card">
                <div class="player-selection">
                  
                  <div class={playerStyle} onClick={handleInfoSelection}>
                    <img src={globe}></img>
                    <h4>Players</h4>
                  </div>

                  <div class={inviteStyle} onClick={handleInfoSelection}>
                    <img src={reply_arrow}></img>
                    <h4>Invites</h4>
                  </div>
                </div>
                
                <div class="search-bar">
                  
                  <img class="search-img" src={Search}></img>
                  {selection? <input spellCheck="false" onChange={filterInvites} type="text" placeholder="Search"></input> : <input spellCheck="false" onChange={filterPlayers} type="text" placeholder="Search"></input>}
                  
                </div>

                <div class="available-players">
                  <ul class="players-list">
                    
                    {selection? searchInvites.map((item, index) => <InvitesItem setRoom={setRoom} setGamePlayers={setGamePlayers} setOrientation={setOrientation} key={item.id} count={Object.keys(searchInvites).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>) : searchPlayers.map((item, index) => <PlayersItem win={win} loss={loss} setRoom={setRoom} setOrientation={setOrientation} key={item.id} count={Object.keys(searchPlayers).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>)}

                  </ul>
                </div>
            </div>
    );
}