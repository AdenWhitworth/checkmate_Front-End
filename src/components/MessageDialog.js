import message_regular from "../Images/message-regular.svg";
import message_solid from "../Images/message-solid.svg";
import paper_plane from "../Images/Paper Plane.svg";
import MessageItem from "../components/MessageItem";
import {useState, useEffect, useRef} from "react";
import {v4 as uuidv4} from "uuid";
import Badge from '@mui/material/Badge';

export default function MessageDialog({username, socket, room}) {

    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState([]);
    const message_txt_container = useRef(null);
    const [messagesToggle, setMessagesToggle] = useState(false); 
    const [messageError, setMessageError] = useState(false);
    const [newMessage, setNewMessage] = useState(null);
    const [messageBadge, setMessageBadge] = useState(0);
    const [messageStyle, setMessageStyle] = useState(message_regular);
    const [incommingMessage, setIncommingMessage] = useState(null);

    const handleSend = () => {

        if (messageError === true){
            return;
        }

        const id = uuidv4();

        var date = new Date();
        var minutes = date.getMinutes();
        var hours = date.getHours();
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

        if (hour < 10){
            if (minutes < 10){
                time = `0${hour}:0${minutes} ${ampm}`;
            } else {
                time = `0${hour}:${minutes} ${ampm}`;
            }
        } else {
            time = `${hour}:${minutes} ${ampm}`;
        }

        const messagesCopy = [...messages];
        const item = {message: textInput, time: time, username: username, room: room, messageError: messageError};
        messagesCopy.push({id: id, item: item});

        setMessageError(false);
        setMessages(messagesCopy);
        setNewMessage({id: id, item: item});
    }

    const handleSoccetSendMessage = () => {
        socket.emit("sendGameMessage", newMessage ,(response) => {
            if (response.error){
                
                setMessageError(true);

                const messagesCopy = [...messages];
                var lastMessage = messagesCopy.pop();
                lastMessage.item.messageError = true;
                messagesCopy.push(lastMessage);

                setMessages(messagesCopy);
            }else {
                if (messageError === true){
                    setMessageError(false);

                    const messagesCopy = [...messages];
                    var lastMessage = messagesCopy.pop();
                    lastMessage.item.messageError = false;
                    messagesCopy.push(lastMessage);

                    setMessages(messagesCopy);
                }
            }
        });
    }

    const handleSoccetRecieveMessage = () => {
        socket.on("sendGameMessage", async (data, callback) => {
          let error, message;
          try{
            setIncommingMessage(data);
            error = false;
            message = "Successfully recieved message";
    
            callback({error,message});
    
          } catch(e){
            error = true;
            message = e;
    
            callback({error,message});
          }
        });
    }

    const appendOpponentMessage = () => {
        if (incommingMessage !== null){
            const messagesCopy = [...messages];
            const item = {message: incommingMessage.item.message, time: incommingMessage.item.time, username: incommingMessage.item.username, room: incommingMessage.item.room};//format the information needed for the message
            messagesCopy.push({id: incommingMessage.id, item: item});

            setMessages(messagesCopy);

            if (messagesToggle === false){
                setMessageBadge(messageBadge + 1);
            }
        }
    }

    const bottomScrollMessages = () => {
        if (messagesToggle === true){
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
        }
    }

    const handleFormattedMessage = () => {
        if (messagesToggle === true && messages !== "" && newMessage !== null){
            setTextInput('');
            handleSoccetSendMessage();
        }
    }

    const handleType = (event) => {
        setTextInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            handleSend();
        }
    }

    const showMessages = () => {
        setMessageBadge(0);
        setMessagesToggle(!messagesToggle);
    }

    const retrySendMessage = () => {
        handleSoccetSendMessage();
    }

    const handleMessagesToggle = () => {
        if(messagesToggle === true){
            setMessageStyle(message_solid);
            bottomScrollMessages();
        } else {
            setMessageStyle(message_regular);
        }
    }

    useEffect(() => {
        handleSoccetRecieveMessage();
    }, []);

    useEffect(() => {
        appendOpponentMessage();
    },[incommingMessage]);

    useEffect(() => {
        bottomScrollMessages();
    },[messages])
    
    useEffect(() => {
        handleFormattedMessage();
    }, [newMessage])

    useEffect(() => {
        handleMessagesToggle();
    },[messagesToggle])

    return (

        <div class="message-container">
            {messagesToggle? 
            <div class="message-toggle">
                <ul class="message-txt-container" ref={message_txt_container}>
                    
                    {messages.map((item) => <MessageItem messages={messages} retrySendMessage={retrySendMessage} username={username} key={item.id} item={item}/>)}
                    
                </ul>

                <div class="message-entry">
                        <input value={textInput} onKeyDown={handleKeyPress} onChange={handleType} type="text" placeholder="Text message..."></input>
                        <img onClick={handleSend} src={paper_plane}></img>
                </div>
            </div>
            :<></>}

            <div class="message-icon-container">
                <Badge onClick={showMessages} badgeContent={messageBadge} color="primary"><img class="message-icon" src={messageStyle}></img></Badge>
            </div>  
        </div>

             
    );
}