import gold_medal from "../Images/Gold Medal.svg";
import silver_medal from "../Images/Silver Medal.svg";
import bronze_medal from "../Images/Bronze Medal.svg";
import {useState, useEffect} from "react";

export default function LeaderItem({item, index}) {

    const [medalStyle, setMedalStyle] = useState("");//CSS for medal
    const [medalImg, setMedalImg] = useState(gold_medal);//style for medal img
    const [colorStyle, setColorStyle] = useState("");//CSS for list item odd or even color

    useEffect(() =>{

        //Index needs to be offset by 1 to reflect place
        const place = index + 1;

        //Set appropriate medal img and style based on place
        //only 1st 2nd 3rd get medals rest of the leaderboard does not
        if (place == 1){
            setMedalStyle("medal-logo");
            setMedalImg(gold_medal)
        } else if(place == 2){
            setMedalStyle("medal-logo");
            setMedalImg(silver_medal)
        } else if(place == 3){
            setMedalStyle("medal-logo");
            setMedalImg(bronze_medal)
        } else {
            setMedalStyle("medal-logo no-medal");
            setMedalImg(gold_medal)
        }

        //alternate odd and even list item colors
        if (Math.abs(place % 2) == 1){
            setColorStyle("medal-list odd-color");
        } else{
            setColorStyle("medal-list even-color");
        }

      },[])

    return (

        <li>
            <div class={colorStyle}>
            <img class={medalStyle} src={medalImg}></img>
            <h3 class="medal-place">{index + 1}.</h3>
            <h3 class="medal-user">{item.item.username}</h3>
            <h3 class="medal-wins">Win: {item.item.win}</h3>
            <h3 class="medal-lost">Loss: {item.item.loss}</h3>
            </div>
        </li>

    );
}