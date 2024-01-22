import message_regular from "../Images/message-regular.svg";
import message_solid from "../Images/message-solid.svg";
import paper_plane from "../Images/Paper Plane.svg";
import MessageItem from "../components/MessageItem";
import {useState, useEffect, useRef} from "react";
import {v4 as uuidv4} from "uuid";
import Badge from '@mui/material/Badge';

export default function MessageDialog({username, socket, room}) {

    const [textInput, setTextInput] = useState('');//use to track input text from user
    const [messages, setMessages] = useState([]);//use to hold all messages
    const message_txt_container = useRef(null);//use to scroll the message to the bottom
    const [messagesToggle, setMessagesToggle] = useState(false);//use to show/hide message field 
    const [messageError, setMessageError] = useState(false);//use to show error sending message
    const [newMessage, setNewMessage] = useState(null);//use to hold most recent message data
    const [messageBadge, setMessageBadge] = useState(0);//use to keep track of message badge count
    const [messageStyle, setMessageStyle] = useState(message_regular);//use to change message image
    const [incommingMessage, setIncommingMessage] = useState(null);

    //To send the message
    const handleSend = () => {

        //if there is an error sending the previous message, then dont allow for another to be sent until the previous is successful
        if (messageError === true){
            return;
        }

        const id = uuidv4();//create a unique id for the map

        //Get the current date
        var date = new Date();
        var minutes = date.getMinutes();//return the minutes
        var hours = date.getHours();//return the hours military format
        let hour;//AMPM format

        //Convert to AM/PM hours
        if (hours > 12){
            hour = hours - 12;
        } else {
            hour = hours;
        }

        //establish AM or PM
        var ampm = (hours >= 12) ? "PM" : "AM";

        let time;//format time string

        //format the time to have a two digits for hour and minute
        if (hour < 10){//if hour less than 10, then add a 0 to make it 2 digits
            if (minutes < 10){//if minute less than 10, then add a 0 to make it 2 digits 
                time = `0${hour}:0${minutes} ${ampm}`;
            } else {
                time = `0${hour}:${minutes} ${ampm}`;
            }
        } else {//already has 2 digits for each
            time = `${hour}:${minutes} ${ampm}`;
        }

        const messagesCopy = [...messages];//create acopy of the messages
        const item = {message: textInput, time: time, username: username, room: room, messageError: messageError};//format the information needed for the message
        messagesCopy.push({id: id, item: item});//push the new message to the copy

        setMessageError(false);//no error as of now
        setMessages(messagesCopy);//update the messages object
        setNewMessage({id: id, item: item});//keep track of the most recent message
    }

    const handleSoccetSendMessage = () => {
        socket.emit("sendGameMessage", newMessage ,(response) => {//emit sentGameMessage to server passing the new message 
            if (response.error){//if there is an error sending this message from the server to other player, then flag this message as an error
                
                setMessageError(true);//dont allow any more messages to be sent

                const messagesCopy = [...messages];//create acopy of the messages
                var lastMessage = messagesCopy.pop();//remove the last message from the copy
                lastMessage.item.messageError = true;//update the error to be true
                messagesCopy.push(lastMessage);//push the last message with updated error back to the copy

                setMessages(messagesCopy);//reset the messages such that the latest message shows an error
            }else {
                if (messageError === true){//for error resend messages reset the error to allow more messages to be sent
                    setMessageError(false);//allow for more messages to be sent

                    const messagesCopy = [...messages];//create acopy of the messages
                    var lastMessage = messagesCopy.pop();//remove the last message from the copy
                    lastMessage.item.messageError = false;//update the error to be false
                    messagesCopy.push(lastMessage);//push the last message with updated error back to the copy

                    setMessages(messagesCopy);//reset the messages such that the latest message shows an error
                }
            }
        });
    }

    useEffect(() => {
        //establish socket.on for recieving messages
        handleSoccetRecieveMessage();
    }, []);

    const handleSoccetRecieveMessage = () => {
        socket.on("sendGameMessage", async (data, callback) => {//handle recieving hew message from opponent socket
          let error, message;
          try{
            setIncommingMessage(data);//update with new message from opponent
            error = false;
            message = "Successfully recieved message";
    
            callback({error,message});//set callback to show success recieving the message
    
          } catch(e){
            error = true;
            message = e;
    
            callback({error,message});//set callback to show error recieving the message
          }
        });
    }

    useEffect(() => {
        //everytime there is a new message from the opponent added it to the chat messages
        if (incommingMessage !== null){//only add the new message if it exists
            const messagesCopy = [...messages];//create acopy of the messages
            const item = {message: incommingMessage.item.message, time: incommingMessage.item.time, username: incommingMessage.item.username, room: incommingMessage.item.room};//format the information needed for the message
            messagesCopy.push({id: incommingMessage.id, item: item});//push the new message to the copy

            setMessages(messagesCopy);//update the messages object

            if (messagesToggle === false){//only increase the badge number if the text field is not visible to the user
                setMessageBadge(messageBadge + 1);
            }
        }
    },[incommingMessage])

    //on a new message scroll to the bottom to show most recent message
    useEffect(() => {
        if (messagesToggle === true){//only scroll to the bottom when the text field is shown to the user
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
        }
    },[messages])
    
    //when a message has been formatted to send allow for the message to be handled by the socket
    useEffect(() => {
        if (messagesToggle === true && messages !== "" && newMessage !== null){
            setTextInput('');//clear the text input field 
            handleSoccetSendMessage();
        }
    }, [newMessage])

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

    const showMessages = () => {
        setMessageBadge(0);
        setMessagesToggle(!messagesToggle);//toggle the messaging field based on button selection
    }

    const retrySendMessage = () => {//when there is an error sending a message, allow for retry button 
        handleSoccetSendMessage();
    }

    useEffect(() => {
        //toggle between showing and hiding the messages text field
        if(messagesToggle === true){//when the text field is being shown to the user 
            setMessageStyle(message_solid);//make the image be filled
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;//scroll to the bottom of the text field
        } else {//when the text field is hidden 
            setMessageStyle(message_regular);//make the image hollow
        }
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