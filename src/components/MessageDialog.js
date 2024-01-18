import message_regular from "../Images/message-regular.svg";
import paper_plane from "../Images/Paper Plane.svg";
import MessageItem from "../components/MessageItem";
import {useState, useEffect, useRef} from "react";
import {v4 as uuidv4} from "uuid";

export default function MessageDialog(username) {

    const [textInput, setTextInput] = useState('');//use to track input text from user
    const [messages, setMessages] = useState([]);//use to hold all messages
    const message_txt_container = useRef(null);//use to scroll the message to the bottom

    //To send the message
    const handleSend = () => {

        const id = uuidv4();//create a unique id for the map

        //Get the current date
        var date = new Date();
        var minutes = date.getMinutes();//return the minutes
        var hours = date.getHours();//return the hours
        let hour;

        //Convert to AM/PM hours
        if (hours > 12){
            hour = hours - 12;
        } else {
            hour = hours;
        }
        //establish AM or PM
        var ampm = (hours >= 12) ? "PM" : "AM";

        let time;

        //format the time to have a two digits for hour and minute
        if (hour < 10){
            if (minutes < 10){
                time = `0${hour}:0${minutes} ${ampm}`;
            } else {
                time = `0${hour}:${minutes} ${ampm}`;
            }
        } else {
            time = `${hour}:${minutes} ${ampm}`;
        }

        const messagesCopy = [...messages];//create acopy of the messages
        const item = {message: textInput, time: time, username: username};//format the information needed for the message
        messagesCopy.push({id: id, item: item});//push the new message to the copy

        setMessages(messagesCopy);//update the messages object
    }

    //on a new message clear the text field and scroll to the bottom to show most recent message
    useEffect(() => {
        setTextInput('');
        message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;

    },[messages])
    
    //updsate the text state based on user input
    const handleType = (event) => {
        setTextInput(event.target.value);
    }

    //register the enter key as a send message button click
    const handleKeyPress = (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            handleSend();
        }
    }

    return (

        <div class="message-container">

            <ul class="message-txt-container" ref={message_txt_container}>
                
                {messages.map((item) => <MessageItem username={username} key={item.id} item={item}/>)}
                
            </ul>

            <div class="message-entry">
                    <input value={textInput} onKeyDown={handleKeyPress} onChange={handleType} type="text" placeholder="Text message..."></input>
                    <img onClick={handleSend} src={paper_plane}></img>
            </div>

            <div class="message-icon-container">
                <img class="message-icon" src={message_regular}></img>
            </div>  
        </div>

             
    );
}