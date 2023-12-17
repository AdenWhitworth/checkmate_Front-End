import user_white from "../Images/User White.svg";
import plane from "../Images/Paper Plane.svg";
import {useState, useEffect, useContext} from "react";

import { db } from '../firebase';
import { collection, addDoc, doc, getDoc} from "firebase/firestore";
import socket from "../socket";

import {GameContext} from "../components/DashboardCard";


export default function PlayersItem({count ,item, index, playerId, userId, username, setRoom, setOrientation, win, loss}) {
    
    const [colorStyle, setColorStyle] = useState("");
    const [startRoom, setStartRoom] = useState("");

    const {setOpponentInviteId, setOpponentUserName, setOpponentUserId, setOpponentPlayerId, setOpponentWin, setOpponentLoss} = useContext(GameContext);
    
    const handleSoccetCreateRoom = (e) => {
        e.preventDefault();  
        socket.emit("createRoom", (response) => {
            console.log("create room:",response);
            setStartRoom(response);
            setOrientation("white");
            console.log("start room:",startRoom);
        });
    }

    const invitePlayer = async (e) => {
        //e.preventDefault();  
       
        try {
            console.log(item.item);
            const userCollection = collection(db, 'users');

            const DocRef2 = doc(userCollection, item.item.userID);
            const docSnap = await getDoc(DocRef2);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

            setOpponentUserName(docSnap.data().username);
            setOpponentUserId(item.item.userID);
            setOpponentPlayerId(docSnap.data().playerID);
            console.log("wins", docSnap.data().win, "losses", docSnap.data().loss);
            setOpponentWin(docSnap.data().win);
            setOpponentLoss(docSnap.data().loss);
            


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
            setRoom(startRoom);
            console.log("Document written with ID: ", docRef.id);
            setOpponentInviteId(docRef.id);

          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
    
    useEffect(() =>{
        
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
        if (startRoom != ""){
            console.log("invite player now");
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