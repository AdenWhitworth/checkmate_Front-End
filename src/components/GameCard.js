import "../App.css";
import user_circle from "../Images/User Circle.svg";
import arrow_point from "../Images/Arrow Point.svg";
import pawn_white from "../Images/Pawn White.svg";
import pawn_white2 from "../Images/Pawn White 2.svg";
import pawn_white3 from "../Images/Pawn White 3.svg";
import pawn_white4 from "../Images/Pawn White 4.svg";
import pawn_white5 from "../Images/Pawn White 5.svg";
import pawn_white6 from "../Images/Pawn White 6.svg";
import pawn_white7 from "../Images/Pawn White 7.svg";
import pawn_white8 from "../Images/Pawn White 8.svg";
import bishop_white from "../Images/Bishop White.svg";
import bishop_white2 from "../Images/Bishop White 2.svg";
import castle_white from "../Images/Castle White.svg";
import castle_white2 from "../Images/Castle White 2.svg";
import knight_white from "../Images/Knight White.svg";
import knight_white2 from "../Images/Knight White 2.svg";
import queen_white from "../Images/Queen White.svg";
import pawn_black from "../Images/Pawn Black.svg";
import pawn_black2 from "../Images/Pawn Black 2.svg";
import pawn_black3 from "../Images/Pawn Black 3.svg";
import pawn_black4 from "../Images/Pawn Black 4.svg";
import pawn_black5 from "../Images/Pawn Black 5.svg";
import pawn_black6 from "../Images/Pawn Black 6.svg";
import pawn_black7 from "../Images/Pawn Black 7.svg";
import pawn_black8 from "../Images/Pawn Black 8.svg";
import bishop_black from "../Images/Bishop Black.svg";
import bishop_black2 from "../Images/Bishop Black 2.svg";
import castle_black from "../Images/Castle Black.svg";
import castle_black2 from "../Images/Castle Black 2.svg";
import knight_black from "../Images/Knight Black.svg";
import knight_black2 from "../Images/Knight Black 2.svg";
import queen_black from "../Images/Queen Black.svg";
import {useState, useEffect, useContext} from "react";
import {GameContext} from "../components/DashboardCard";
import GameItem from "../components/GameItem";
import {v4 as uuidv4} from "uuid";


export default function GameCard({gameplayers, username, orientation, win, loss}) {

    const [opponentPlayerStyle, setOpponentPlayerStyle] = useState("game-info player-turn");//CSS for opponent player to show turn
    const [activePlayerStyle, setActivePlayerStyle] = useState("game-info");//CSS for active player to show turn
    const [capturedPieces, setCapturedPieces] = useState([
        {
            player: "w",
            p: 0,
            n: 0,
            b: 0,
            r: 0,
            q: 0,
        },
        {
            player: "b",
            p: 0,
            n: 0,
            b: 0,
            r: 0,
            q: 0,
        }
    ]);//object to record number of each pieces captured for white and black

    //active player CSS and img styling
    const [playerPawnStyle, setPlayerPawnStyle] = useState("");
    const [playerPawnImg, setPlayerPawnImg] = useState("");
    const [playerKnightStyle, setPlayerKnightStyle] = useState("");
    const [playerKnightImg, setPlayerKnightImg] = useState("");
    const [playerBishopStyle, setPlayerBishopStyle] = useState("");
    const [playerBishopImg, setPlayerBishopImg] = useState("");
    const [playerCastleStyle, setPlayerCastleStyle] = useState("");
    const [playerCastleImg, setPlayerCastleImg] = useState("");
    const [playerQueenStyle, setPlayerQueenStyle] = useState("");
    const [playerQueenImg, setPlayerQueenImg] = useState("");
    //opponent player CSS and img styling
    const [opponentPawnStyle, setOpponentPawnStyle] = useState("");
    const [opponentPawnImg, setOpponentPawnImg] = useState("");
    const [opponentKnightStyle, setOpponentKnightStyle] = useState("");
    const [opponentKnightImg, setOpponentKnightImg] = useState("");
    const [opponentBishopStyle, setOpponentBishopStyle] = useState("");
    const [opponentBishopImg, setOpponentBishopImg] = useState("");
    const [opponentCastleStyle, setOpponentCastleStyle] = useState("");
    const [opponentCastleImg, setOpponentCastleImg] = useState("");
    const [opponentQueenStyle, setOpponentQueenStyle] = useState("");
    const [opponentQueenImg, setOpponentQueenImg] = useState("");

    //useContext required to move the data laterally from the active game to the GameCard without triggering a rerender of the parent DashboardCard
    const gameContext = useContext(GameContext);//context to access game history and player turn
    const [gameMoves, setGameMoves] = useState([]);//object for game moves

    const updateCapturedPieces = () => {

        const pawn_imgs_black = [pawn_black, pawn_black, pawn_black2, pawn_black3, pawn_black4, pawn_black5, pawn_black6, pawn_black7, pawn_black8];
        const knight_imgs_black = [knight_black, knight_black, knight_black2];
        const bishop_imgs_black = [bishop_black, bishop_black, bishop_black2];
        const castle_imgs_black = [castle_black, castle_black, castle_black2];
        const queen_imgs_black = [queen_black, queen_black];

        const pawn_imgs_white = [pawn_white, pawn_white, pawn_white2, pawn_white3, pawn_white4, pawn_white5, pawn_white6, pawn_white7, pawn_white8];
        const knight_imgs_white = [knight_white, knight_white, knight_white2];
        const bishop_imgs_white = [bishop_white, bishop_white, bishop_white2];
        const castle_imgs_white = [castle_white, castle_white, castle_white2];
        const queen_imgs_white = [queen_white, queen_white];

        const pieces_imgs = [
            [
                pawn_imgs_white,
                knight_imgs_white,
                bishop_imgs_white,
                castle_imgs_white,
                queen_imgs_white,
            ],
            [
                pawn_imgs_black,
                knight_imgs_black,
                bishop_imgs_black,
                castle_imgs_black,
                queen_imgs_black,
            ]
        ];

        const playerImgStates = [setPlayerPawnImg, setPlayerKnightImg, setPlayerBishopImg, setPlayerCastleImg, setPlayerQueenImg];
        const playerStyleStates = [setPlayerPawnStyle, setPlayerKnightStyle, setPlayerBishopStyle, setPlayerCastleStyle, setPlayerQueenStyle];
        const opponentImgStates = [setOpponentPawnImg, setOpponentKnightImg, setOpponentBishopImg, setOpponentCastleImg, setOpponentQueenImg];
        const opponentStyleStates = [setOpponentPawnStyle, setOpponentKnightStyle, setOpponentBishopStyle, setOpponentCastleStyle, setOpponentQueenStyle];

        if (orientation[0] === "w"){
            //board orientation is white
            //player is white
            //opponent is black

            //capturedPieces[0] is white & capturedPieces[1] is black
            //pieces_imgs[0] is white & pieces_imgs[1] is black

            //update Player to show their captured pieces
            
            //this index of the object is used to change the state img and style as it is formated to match the capturedPieces
            var pieceIndexPlayer = 0;
            
            for (let piece in capturedPieces[0]){//iterate through the captured pieces object to return the number of each type of piece captured
                
                if (piece !== "player"){//skip past the player color as we need the pieces to line up with the img array

                    if (capturedPieces[0][piece] === 0){//if number captured is 0 then hide the piece
                        playerStyleStates[pieceIndexPlayer]("game-pieces-captured game-pieces-captured-hidden");
                    } else {//show the piece
                        playerStyleStates[pieceIndexPlayer]("game-pieces-captured");
                    }

                    //depending on the piece captured, the number captured is used to link to the image needed to show
                    //As this player is white, they are capturing black pieces
                    playerImgStates[pieceIndexPlayer](pieces_imgs[1][pieceIndexPlayer][capturedPieces[0][piece]]);

                    ++pieceIndexPlayer;
                }
            };

            //Update opponent to show their captured pieces
            //this index of the object is used to change the state img and style as it is formated to match the capturedPieces
            var pieceIndexOpponent = 0;
            
            for (let piece in capturedPieces[1]){//iterate through the captured pieces object to return the number of each type of piece captured
                
                if (piece !== "player"){//skip past the player color as we need the pieces to line up with the img array

                    if (capturedPieces[1][piece] === 0){//if number captured is 0 then hide the piece
                        opponentStyleStates[pieceIndexOpponent]("game-pieces-captured game-pieces-captured-hidden");
                    } else {//show the piece
                        opponentStyleStates[pieceIndexOpponent]("game-pieces-captured");
                    }

                    //depending on the piece captured, the number captured is used to link to the image needed to show
                    //As this player is black, they are capturing white pieces
                    opponentImgStates[pieceIndexOpponent](pieces_imgs[0][pieceIndexOpponent][capturedPieces[1][piece]]);

                    ++pieceIndexOpponent;
                }
            };

        } else {
            //board orientation is black
            //player is black
            //opponent is white

            //capturedPieces[0] is white & capturedPieces[1] is black
            //pieces_imgs[0] is white & pieces_imgs[1] is black

            //update Player to show their captured pieces
            //this index of the object is used to change the state img and style as it is formated to match the capturedPieces
            var pieceIndexPlayer = 0;
            
            for (let piece in capturedPieces[1]){//iterate through the captured pieces object to return the number of each type of piece captured
                
                if (piece !== "player"){

                    if (capturedPieces[1][piece] === 0){//skip past the player color as we need the pieces to line up with the img array
                        playerStyleStates[pieceIndexPlayer]("game-pieces-captured game-pieces-captured-hidden");
                    } else {//show the piece
                        playerStyleStates[pieceIndexPlayer]("game-pieces-captured");
                    }

                    //depending on the piece captured, the number captured is used to link to the image needed to show
                    //As this player is black, they are capturing white pieces
                    playerImgStates[pieceIndexPlayer](pieces_imgs[0][pieceIndexPlayer][capturedPieces[1][piece]]);

                    ++pieceIndexPlayer;
                }
            } 

            //Update opponent to show their captured pieces
            //this index of the object is used to change the state img and style as it is formated to match the capturedPieces
            var pieceIndexOpponent = 0;
            
            for (let piece in capturedPieces[0]){//iterate through the captured pieces object to return the number of each type of piece captured
                
                if (piece !== "player"){

                    if (capturedPieces[0][piece] === 0){//skip past the player color as we need the pieces to line up with the img array
                        opponentStyleStates[pieceIndexOpponent]("game-pieces-captured game-pieces-captured-hidden");
                    } else {//show the piece
                        opponentStyleStates[pieceIndexOpponent]("game-pieces-captured");
                    }

                    //depending on the piece captured, the number captured is used to link to the image needed to show
                    //As this player is white, they are capturing black pieces
                    opponentImgStates[pieceIndexOpponent](pieces_imgs[1][pieceIndexOpponent][capturedPieces[0][piece]]);

                    ++pieceIndexOpponent;
                }
            }  
        }
    }

    //see whos turn it is change the player card to highlight that players turn
    const activeTurn = () => {
        //compare player turn to orientation of the board in order to see who the active and opponent players are
        if (orientation[0] === "w" && gameContext.playerTurn === "w"){
            setOpponentPlayerStyle("game-info");
            setActivePlayerStyle("game-info player-turn");
        } else if (orientation[0] === "w" && gameContext.playerTurn === "b"){
            setOpponentPlayerStyle("game-info player-turn");
            setActivePlayerStyle("game-info");
        } else if (orientation[0] === "b" && gameContext.playerTurn === "w"){
            setOpponentPlayerStyle("game-info player-turn");
            setActivePlayerStyle("game-info");
        } else if (orientation[0] === "b" && gameContext.playerTurn === "b"){
            setOpponentPlayerStyle("game-info");
            setActivePlayerStyle("game-info player-turn");
        }
    }

    //take the history object created by chess.js api and format it for our UI
    const formatHistory = () => {

        //only format history once the first move is made
        if (gameContext.history.length !== 0){

            //for the game moves ovject format where each index has one white and black move
            const historyLength = gameContext.history.length;
            const gameMovesCopy = [...gameMoves];//make a copy of game moves
            const gameMovesCopyLength = gameMovesCopy.length
            const id = uuidv4();//create a unique id for the map
            
            if (Math.abs(historyLength % 2) === 1){
                //odd occurance
                //create a new index of the object
                //Move made by white and then a blank move for black
                const item = [gameContext.history[historyLength-1].to,""]
                gameMovesCopy.push({id: id, item: item});
                setGameMoves(gameMovesCopy);
                
            } else {
                //even occurance
                //replace the blank move made by black in the odd occurance with the actual move now made by black
                gameMovesCopy[gameMovesCopyLength-1].item[1] = gameContext.history[historyLength-1].to;
                setGameMoves(gameMovesCopy);

            }
        }
    }

    //check to see which pieces in the game history were just captured
    //this will be used to update the UI of the captured pieces
    const checkCaptured = () => {
        //only check once the first move has been made
        if (gameContext.history.length !== 0){

            const historyLength = gameContext.history.length;

            const capturedPiecesCopy = [...capturedPieces];//copy the captured pieces object

            const capturedPiece = gameContext.history[historyLength-1].captured; //get the last captured piece from the history
            
            //check to see whos turn it was when the piece was captured
            //update the captured pieces object based on the turn and the piece captured
            if (gameContext.history[historyLength-1].color === "w"){

                if (capturedPiece === "p"){
                    ++capturedPiecesCopy[0].p
                } else if (capturedPiece === "n"){
                    ++capturedPiecesCopy[0].n
                } else if (capturedPiece === "b") {
                    ++capturedPiecesCopy[0].b
                } else if (capturedPiece === "r") {
                    ++capturedPiecesCopy[0].r
                } else if (capturedPiece === "q") {
                    ++capturedPiecesCopy[0].q
                }

            }else{
                if (capturedPiece === "p"){
                    ++capturedPiecesCopy[1].p
                } else if (capturedPiece === "n"){
                    ++capturedPiecesCopy[1].n
                } else if (capturedPiece === "b") {
                    ++capturedPiecesCopy[1].b
                } else if (capturedPiece === "r") {
                    ++capturedPiecesCopy[1].r
                } else if (capturedPiece === "q") {
                    ++capturedPiecesCopy[1].q
                }

            }

            setCapturedPieces(capturedPiecesCopy);//trigger a re-render based on the new captured pieces

        }
    }

    useEffect(() => {
        //update the captured pieces
        updateCapturedPieces();
    }, [capturedPieces]);

    useEffect(() => {
        //update UI to show which players turn it is
        activeTurn();
    }, [gameContext.playerTurn]);

    useEffect(() => {
        //Format the history so that we can check for captured peices
        formatHistory();
        checkCaptured();
    }, [gameContext.history]);

  return (
    <div class="game-card">
        <div class={opponentPlayerStyle}>
        <div class="game-stats">
            <div class="game-row-1">
            <img class="game-icon" src={user_circle} alt="opponent user"></img>
            {(gameplayers.length < 2)? <h3 class="game-username">Waiting on {gameContext.opponentUserName}...</h3> : <h3 class="game-username">{gameContext.opponentUserName}</h3>}
            </div>
            <div class="game-row-2">
            {(gameplayers.length < 2)? <h3 class="game-wins">Win: ...</h3> : <h3 class="game-wins">Win: {gameContext.opponentWin}</h3>}
            {(gameplayers.length < 2)? <h3 class="game-loss">Loss: ...</h3> : <h3 class="game-loss">Loss: {gameContext.opponentLoss}</h3>}
            </div>
            <div class="game-row-3">

                <img class={opponentPawnStyle} src={opponentPawnImg} alt="opponent pawn"></img>
                <img class={opponentKnightStyle} src={opponentKnightImg} alt="opponent knight"></img>
                <img class={opponentBishopStyle} src={opponentBishopImg} alt="opponent bishop"></img>
                <img class={opponentCastleStyle} src={opponentCastleImg} alt="opponent castle"></img>
                <img class={opponentQueenStyle} src={opponentQueenImg} alt="opponent queen"></img>
            
            </div>
            
        </div>
        </div>
        
        <div class="moves-header">
        <img class="moves-icon" src={arrow_point} alt="Arrow Icon for game moves"></img>
        <h3 class="moves-header-text">Game Moves</h3>
        </div>
        <div class="moves-card">
        
        <ul class="moves-list">

            {gameMoves.map((item, index) => <GameItem key={item.id} count={Object.keys(gameMoves).length} item={item} index={index}/>)}

        </ul>
        </div>
        

        <div class={activePlayerStyle}>
            <div class="game-stats">
            
            <div class="game-row-1">
                <img class="game-icon" src={user_circle} alt="user"></img>
                <h3 class="game-username">{username}</h3>
            </div>
            <div class="game-row-2">
                <h3 class="game-wins">Win: {win}</h3>
                <h3 class="game-loss">Loss: {loss}</h3>
            </div>
            <div class="game-row-3">
                
                <img class={playerPawnStyle} src={playerPawnImg} alt="pawn"></img>
                <img class={playerKnightStyle} src={playerKnightImg} alt="knight"></img>
                <img class={playerBishopStyle} src={playerBishopImg} alt="bishop"></img>
                <img class={playerCastleStyle} src={playerCastleImg} alt="castle"></img>
                <img class={playerQueenStyle} src={playerQueenImg} alt="queen"></img>
                
            </div>
            
            </div>
        </div>
    </div>
  );
}