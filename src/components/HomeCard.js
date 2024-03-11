import pawn_logo from "../Images/Pawn Logo.svg";
import LeaderItem from "./LeaderItem";

export default function HomeCard({leaders,handlePlayFriends}) {
    return (
        <section data-testid="HomeCard-section" class="content">
            <div class="container">

            <div class="welcome">
                <div class="play">
                <img class="pawn-logo" src={pawn_logo}></img>
                <a onClick={handlePlayFriends} data-testid="playFriendsBtn" class="pawn-btn-fill">Play Friends</a>
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