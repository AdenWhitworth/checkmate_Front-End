import gold_medal from "../Images/Gold Medal.svg";
import silver_medal from "../Images/Silver Medal.svg";
import bronze_medal from "../Images/Bronze Medal.svg";
import {useState, useEffect} from "react";



export default function LeaderItem({item}) {

    const [medalStyle, setMedalStyle] = useState("");
    const [medalImg, setMedalImg] = useState(gold_medal);
    const [colorStyle, setColorStyle] = useState("")

    useEffect(() =>{

        if (item.item.place == 1){
            setMedalStyle("medal-logo");
            setMedalImg(gold_medal)
        } else if(item.item.place == 2){
            setMedalStyle("medal-logo");
            setMedalImg(silver_medal)
        } else if(item.item.place == 3){
            setMedalStyle("medal-logo");
            setMedalImg(bronze_medal)
        } else {
            setMedalStyle("medal-logo no-medal");
            setMedalImg(gold_medal)
        }

        if (Math.abs(item.item.place % 2) == 1){
            setColorStyle("medal-list odd-color");
        } else{
            setColorStyle("medal-list even-color");
        }

      },[])

    return (

        <li>
            <div class={colorStyle}>
            <img class={medalStyle} src={medalImg}></img>
            <h3 class="medal-place">{item.item.place}.</h3>
            <h3 class="medal-user">{item.item.username}</h3>
            <h3 class="medal-wins">Win: {item.item.win}</h3>
            <h3 class="medal-lost">Loss: {item.item.loss}</h3>
            </div>
        </li>

    );
}