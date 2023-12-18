import user_white from "../Images/User White.svg";
import plane from "../Images/Paper Plane.svg";
import {useState, useEffect, useContext} from "react";
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc} from "firebase/firestore";
import socket from "../socket";
import {GameContext} from "../components/DashboardCard";


export default function PlayersItem({count ,item, index, playerId, userId, username, setRoom, setOrientation, win, loss}) {
    
    const [colorStyle, setColorStyle] = useState("");//CSS for list item odd or even color
    const [startRoom, setStartRoom] = useState("");//use to create room

    const {setOpponentInviteId, setOpponentUserName, setOpponentUserId, setOpponentPlayerId, setOpponentWin, setOpponentLoss} = useContext(GameContext);//get opponent data stored in context
    
    //create a new room for the new game 
    //set the player creating the room to white
    const handleSoccetCreateRoom = (e) => {
        e.preventDefault();  
        socket.emit("createRoom", (response) => {
            setStartRoom(response);
            setOrientation("white");
        });
    }

    //invite opponent to game based on the selection from the list
    const invitePlayer = async (e) => { 
       
        try {
            //use the user id given in this item to get all the other opponent data for this player
            const userCollection = collection(db, 'users');
            const DocRef2 = doc(userCollection, item.item.userID);
            const docSnap = await getDoc(DocRef2);

            setOpponentUserName(docSnap.data().username);
            setOpponentUserId(item.item.userID);
            setOpponentPlayerId(docSnap.data().playerID);
            setOpponentWin(docSnap.data().win);
            setOpponentLoss(docSnap.data().loss);

            //Create a new document for the invitation to the opponent
            //include all the information on current player needed by the opponent to join this game
            const DocRef = doc(userCollection, item.item.userID);
            const inviteCollection = collection(DocRef,'invites');

            const docRef = await addDoc(inviteCollection,{
                requestUserID: userId,
                requestUserName: username,
                requestPlayerID: playerId,
                requestRoom: startRoom,
                requestWin: win,
                requestLoss: loss,
            });

            setRoom(startRoom);//set the room now that it has been created
            setOpponentInviteId(docRef.id);//get the invite id for later ability to delete the invite

          } catch (e) {
            return
          }
    }
    
    useEffect(() =>{
        //alternate odd and even list item colors
        //when less than 7 items are in a list then dont allow scroll
        if (Math.abs(index % 2) == 1){
            if (count <= 7){
                setColorStyle("player-line odd-color");
            } else {
                setColorStyle("player-line player-line-scroll odd-color");
            }

        } else{
            
            if (count <= 7){
                setColorStyle("player-line even-color");
            } else {
                setColorStyle("player-line player-line-scroll even-color");
            }
        }

    },[count])

    useEffect(() =>{
        //if there is no room then allow for a player to be invited
        //only invite a player once the socket room has been created
        if (startRoom != ""){
            invitePlayer();
        }
    }, [startRoom])
    
      

    return (

        <li>
            <div class={colorStyle}>
                <img class="player-icon" src={user_white}></img>
                <h3 class="player-username">{item.item.username}</h3>
                <div class="player-request" onClick={handleSoccetCreateRoom}>
                    <img class="request-icon" src={plane}></img>
                    <h3 class="request-text">Invite</h3>
                </div>
            </div>
        </li>

    );
}