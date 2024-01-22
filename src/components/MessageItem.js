import {useState, useEffect} from "react";

export default function MessageItem({item, username, retrySendMessage, messages}) {
    
    const [messageStyle, setMessageStyle] = useState("message-txt");//change the css of the message
    const [fromStyle, setFromStyle] = useState("");//change the css of the sender
    const [errorStyle, setErrorStyle] = useState("message-error txt-player error-hide")//change the css of the error messaage

    useEffect(() => {
        //check if the message is from the user signed in or from the opponent
        if (item.item.username === username){//style message from user
            setMessageStyle("message-txt message-player");
            setFromStyle("txt-player");
        }else {//style message from opponent 
            setMessageStyle("message-txt message-opponent");
            setFromStyle("txt-opponent");
        }
        
    },[])

    useEffect(() => {
        //if there is an error sending the message, then show the error text
        if (item.item.messageError === true){
            setErrorStyle("message-error txt-player");
        } else {
            setErrorStyle("message-error txt-player error-hide");
        }
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