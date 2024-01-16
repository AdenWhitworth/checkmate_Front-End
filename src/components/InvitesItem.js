import user_white from "../Images/User White.svg";
import check from "../Images/Check.svg"
import {useState, useEffect, useContext} from "react";
import { db } from '../firebase';
import { collection, doc, deleteDoc} from "firebase/firestore";
import {GameContext} from "../components/DashboardCard";


export default function InvitesItem({setNetworkError, setNetworkReason, socket, count ,item, index, playerId, userId, username, setRoom, setGamePlayers, setOrientation}) {
    
    const [colorStyle, setColorStyle] = useState("");//CSS for list item odd or even color

    const {setOpponentUserName, setOpponentUserId, setOpponentPlayerId, setOpponentWin, setOpponentLoss} = useContext(GameContext);//get opponent data stored in context

    //from the invitation pull the data needed to join the game
    const joinPlayer = async (e) => {
        e.preventDefault();  

        //set the opponent user information based on item being passed
        setOpponentUserName(item.item.requestUserName);
        setOpponentUserId(item.item.requestUserID);
        setOpponentPlayerId(item.item.requestPlayerID);
        setOpponentWin(item.item.requestWin);
        setOpponentLoss(item.item.requestLoss);

        //allow for the player to join room socket
        handleSoccetJoinRoom();
    }

    //use to join the opponents game socket
    const handleSoccetJoinRoom = () => {
        //check to make sure valid room to join
        if (!item.item.requestRoom) return;
        //emit to other socket that player is joining the room
        socket.emit("joinRoom", { roomId: item.item.requestRoom }, (response) => {//emit the joinRoom and establish a response callback
            if (response.error) {//if there is an error joining, then prompt the user to try again
                
                setNetworkError(true);
                setNetworkReason("Joining");

                return //Dont allow the function to continue if there is an error
            }
            //successfully joined room and now set the board to play
            setRoom(response.RoomUpdate.roomId);
            setGamePlayers(response.RoomUpdate.players);
            setOrientation("black");
            
            //Delete the invitation as player has now joined the game
            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, userId);
            const inviteCollection = collection(DocRef,'invites');
            const DocRef2 = doc(inviteCollection, item.id);
            deleteDoc(DocRef2);
        });
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
      

    return (

        <li>
            <div class={colorStyle}>
                <img class="player-icon" src={user_white}></img>
                <h3 class="player-username">{item.item.requestUserName}</h3>
                <div class="player-request" onClick={joinPlayer}>
                    <img class="request-icon" src={check}></img>
                    <h3 class="request-text">Join</h3>
                </div>
            </div>
        </li>

    );
}