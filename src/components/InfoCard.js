import "../App.css";
import globe from "../Images/Globe.svg";
import reply_arrow from "../Images/Reply Arrow.svg";
import Search from "../Images/Search.svg";
import PlayersItem from "./PlayersItem";
import InvitesItem from "./InvitesItem";
import { db } from '../firebase';
import { query, onSnapshot, collection, where } from "firebase/firestore";  
import {useState, useEffect} from "react";


export default function InfoCard({setNetworkError, setNetworkReason, socket, playerId, userId, username, invites, setRoom, setOrientation, setGamePlayers, room, win, loss, inviteBadgeClick, setInviteBadgeClick}) {

  const [selection, setSelection] = useState(false);//use to determine if user wants to see player list or invite list
  const [playerStyle, setPlayerStyle] = useState("players-option info-selection");//CSS to show player list
  const [inviteStyle, setInviteStyle] = useState("invite-option info-unselection");//CSS to show invite list
  const [players, setPlayers] = useState([]);//object containing all players to invite for a game
  const [searchPlayers, setSearchPlayers] = useState([]);//object filtering players based on search text
  const [searchInvites, setSearchInvites] = useState([]);//object filtering invites based on search text
  
  //toggle between player list and invite list based on selection
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

  //fetch all the player available to play a game against
  const fetchPlayers = async () => {
    
    //get the user ids of all players who sent the currnet player an invite
    var invitesUserIDs = [];
    Object.keys(invites).forEach(key=>{
      invitesUserIDs.push(invites[key].item.requestUserID);
    })

    invitesUserIDs.push(userId);//add current user to the list of invites
    var playersCopy = [];//create a copy of the players 

    //query the players database and find all player exception for those who sent current player invites
    const q = query(collection(db, "players"), where("userID", 'not-in', invitesUserIDs));

    onSnapshot(q, (snapshot) => {

      //map the players for list UI
      playersCopy = snapshot.docs.map(doc => ({
        id: doc.id,
        item: doc.data()
      }))

      setPlayers(playersCopy);
      
    })
  }

  useEffect(() =>{
    //update the players list
    fetchPlayers();
  },[invites])

  useEffect(() =>{
    //update player list on initial load and on any change to players in the database
    setSearchPlayers(players);
  },[players])

  useEffect(() =>{
    //update invites list on initial load and on any change to invites in the database
    setSearchInvites(invites);
  },[invites])

  useEffect(() =>{
    //when notification badge is clicked allow for invitation list to be shown to user
    if (inviteBadgeClick == true){
      handleInfoSelection();
      setInviteBadgeClick(false);
    }
  },[inviteBadgeClick])

  //record typing in players search field and limit based on this search
  const filterPlayers = (e) => {
    const keyword = e.target.value;

    const playersCopy = [...players];//copy the players list
    if (keyword !=''){
      //filter the players list based on what is typed into the search field
      const searchResults = playersCopy.filter((player) => {
        return player.item.username.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearchPlayers(searchResults);
    } else {
      setSearchPlayers(playersCopy);
    }
  }

  //record typing in invites search field and limit based on this search
  const filterInvites = (e) => {
    const keyword = e.target.value;

    const invitesCopy = [...invites];//copy the invites list

    if (keyword !=''){
      //filter the invites list based on what is typed into the search field
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
                    <div>
                      <img src={globe}></img>
                      <h4>Players</h4>
                    </div>
                  </div>

                  <div class={inviteStyle} onClick={handleInfoSelection}>
                    <div>
                      <img src={reply_arrow}></img>
                      <h4>Invites</h4>
                    </div>
                  </div>
                </div>
                
                <div class="search-bar">
                  
                  <img class="search-img" src={Search}></img>
                  {selection? <input spellCheck="false" onChange={filterInvites} type="text" placeholder="Search"></input> : <input spellCheck="false" onChange={filterPlayers} type="text" placeholder="Search"></input>}
                  
                </div>

                <div class="available-players">
                  <ul class="players-list">
                    
                    {selection? searchInvites.map((item, index) => <InvitesItem setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} setRoom={setRoom} setGamePlayers={setGamePlayers} setOrientation={setOrientation} key={item.id} count={Object.keys(searchInvites).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>) : searchPlayers.map((item, index) => <PlayersItem setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} win={win} loss={loss} setRoom={setRoom} setOrientation={setOrientation} key={item.id} count={Object.keys(searchPlayers).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>)}

                  </ul>
                </div>
            </div>
    );
}