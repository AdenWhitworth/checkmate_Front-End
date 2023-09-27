/* Main App where UI will take place  */

import React, {Component}  from 'react';
import Chessboard from "chessboardjsx";
import {Chess} from "chess.js";

class GameLogic extends Component{

  constructor(props){
    super(props);
    this.state = {
      fen: "start",
      history: []
    };
  }

  //when loading in create a new game
  componentDidMount() {
    this.game = new Chess();
  };

  //Logic performed on piece drop
  onDrop = ({sourceSquare, targetSquare}) => {
    let current_move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    })

    if (current_move === null) return;
    this.setState(({ history }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true })
    }));
    
  };
  

  render() {

    return this.props.children({
      position: this.state.fen,
      onDrop: this.onDrop
    });

  };
  
}

export default function App() {
  return (
    <div>
      <h1>Chess</h1>
      <GameLogic>{({
        position,
        onDrop
        }) => (
          <Chessboard
            width= {320}
            id="chess_game" 
            position={position}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
          />
        )}
      </GameLogic>
    </div>
  );
}
