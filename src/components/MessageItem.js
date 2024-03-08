import {useState, useEffect} from "react";

export default function MessageItem({item, username, retrySendMessage, messages}) {
    
    const [messageStyle, setMessageStyle] = useState("message-txt");
    const [fromStyle, setFromStyle] = useState("");
    const [errorStyle, setErrorStyle] = useState("message-error txt-player error-hide");

    const messageStyling = () => {
        //Style based on if message from player or opponent
        if (item.item.username === username){
            setMessageStyle("message-txt message-player");
            setFromStyle("txt-player");
        }else {
            setMessageStyle("message-txt message-opponent");
            setFromStyle("txt-opponent");
        }
    }

    const errorStyling = () => {
        //if there is an error sending the message, then show the error text
        if (item.item.messageError === true){
            setErrorStyle("message-error txt-player");
        } else {
            setErrorStyle("message-error txt-player error-hide");
        }
    }

    useEffect(() => {
        messageStyling();
    },[])

    useEffect(() => {
        errorStyling();
    },[messages])

    return (

        <li>
            <div class="message-full">
                    <div class={messageStyle}>
                        <h4>{item.item.message}</h4>
                    </div>
                    <h5 class={fromStyle}>{item.item.username} - {item.item.time}</h5>
                    <h5 class={errorStyle}>Error! <button onClick={retrySendMessage}>Resend</button></h5>
                                        
            </div>
        </li>

    );
}