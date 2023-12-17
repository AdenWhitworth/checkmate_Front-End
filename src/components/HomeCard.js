import board_logo from "../Images/Chess Board Logo.svg";
import pawn_logo from "../Images/Pawn Logo.svg";
import LeaderItem from "./LeaderItem";

export default function HomeCard({leaders,handlePlayFriends}) {
    return (
        <section class="content">
            <div class="container">

            <div class="welcome">
                <img class="board-logo" src={board_logo}></img>
                <div class="play">
                <img class="pawn-logo" src={pawn_logo}></img>
                <a onClick={handlePlayFriends} class="pawn-btn-fill">Play Friends</a>
                </div>
            </div>          
            
            <div class="leaderboard">
                <h1>Leader Board</h1>
                <ul class="leader-list">
                    {leaders.map((item, index) => <LeaderItem key={item.id} item={item} index={index}/>)}
                
                </ul>
            </div>
            </div>
        </section>
    );
}