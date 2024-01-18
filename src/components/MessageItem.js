import {useState, useEffect} from "react";

export default function MessageItem({item, username}) {
    
    const [messageStyle, setMessageStyle] = useState("");//change the css of the message
    const [fromStyle, setFromStyle] = useState("");//change the css of the sender

    useEffect(() => {
        //check if the message is from the user signed in or the opponent
        if (item.item.username.username === username.username){//style message from user
            setMessageStyle("message-txt message-player");
            setFromStyle("txt-player");
        }else {//style message from opponent 
            setMessageStyle("message-txt message-opponent");
            setFromStyle("txt-opponent");
        }
        
    },[])

    return (

        <li>
            <div class="message-full">
                    <div class={messageStyle}>
                        <h4>{item.item.message}</h4>
                    </div>
                    <h5 class={fromStyle}>{item.item.username.username} - {item.item.time}</h5>
            </div>
        </li>

    );
}