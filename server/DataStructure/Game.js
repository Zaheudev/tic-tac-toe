// here stands the logic for the game
// letter "O" stands for human and letter "X" stands for bot if it's a singleplayer game

function Game() {
  this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.corners = [0,2,6,8];
  this.turn = "X";
  this.movesCounter = 0;
  this.firstMove = null;

  this.getBoard = () => {
    return this.board;
  };

  this.getTurn = () => {
    return this.turn;
  }

  this.shiftTurn = () => {
    if(this.turn === "X"){
      this.turn = "O";
    }else {
      this.turn = "X";
    }
  }

  // here's the main function to make a move. It will change accordingly when adding player vs player.
  this.setCell = (cell, player) => {
    if(this.checkBoardState()){
      //here checks if the state isn't draw, or in win state and quit the rest of execution.
      return false;
    }
    // here checks if the player arg is it's turn and if the cell arg isn't already selected.
    if(player === this.turn && typeof this.board[cell] !== "string"){ 
      this.board[cell] = player;
      this.shiftTurn();
      if(this.movesCounter === 0){
        this.firstMove = {cell: cell, player: player};
      }
      this.movesCounter++;
      return true;
    }
    return false;
  };
  
  this.botMove = () => {
    if(this.checkBoardState()){
      return;
    }

    let move = this.bestChoice("O")
    this.setCell(move.cell, "O");
    return move.score;
  };

  this.getEmptyCells = () => {
    return this.board.filter(i => i !== "O" && i !== "X");
  };

  this.resetBoard = () => {
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.turn = "X";
    this.firstMove = null;
    this.movesCounter = 0;
  }

  this.checkWinning = (player) => {
    if (
      (this.board[0] == player && this.board[1] == player && this.board[2] == player) ||
      (this.board[3] == player && this.board[4] == player && this.board[5] == player) ||
      (this.board[6] == player && this.board[7] == player && this.board[8] == player) ||
      (this.board[0] == player && this.board[3] == player && this.board[6] == player) ||
      (this.board[1] == player && this.board[4] == player && this.board[7] == player) ||
      (this.board[2] == player && this.board[5] == player && this.board[8] == player) ||
      (this.board[0] == player && this.board[4] == player && this.board[8] == player) ||
      (this.board[2] == player && this.board[4] == player && this.board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  };

  // here evaluates state of the current presset and returns the value accordingly.
  this.checkBoardState = () => {
    if(this.getEmptyCells().length < 1){
      return "draw";
    }
    if(this.checkWinning("X")){
      return "X";
    }else if(this.checkWinning("O")){
      return "O";
    }
    return false;
  }

  // this is a function that helps the this.bestChoice() to evaluate every move temporarily made in order the find the best one.
  this.checkMoveState = (player, opponent) => {
    if(this.checkWinning(opponent)){
      return -10;
    }else if(this.checkWinning(player)){
      return 10;
    }else{
      return 0;
    }
  }

  // this function is to get the best move from current presset of board. Now works perfectly, it's unbeatable.
  // basically this function is minimax algorithm.
  this.bestChoice = (player) => {
    let emptyCells = this.getEmptyCells();
    let moves = [];
    const OPPONENT = player === "X" ? "O" : "X";

    if(this.movesCounter === 1 && this.corners.find(e => e === this.firstMove.cell) !== undefined){
      return {cell: 4, score: 0};
    }

    //here checks if the 'player' is in win state and if not insert all possible moves in a array to iterate later to find best move
    //this may be refactored to a better solution in future, now works fine.
    for(let i=0; i<emptyCells.length; i++){
      let move = {};

      move.cell = this.board[emptyCells[i]];

      this.board[emptyCells[i]] = player;
      
      move.score = this.checkMoveState(player, OPPONENT);
      if(move.score === 10){
        console.log("in win state");
        this.board[emptyCells[i]] = player;
        return move;
      }
      moves.push(move);
      this.board[emptyCells[i]] = move.cell;
    }

    //here's checks if opponent wins in next move
    for(let i=0; i<emptyCells.length; i++){
      let move = {};
      move.cell = this.board[emptyCells[i]];
      this.board[emptyCells[i]] = OPPONENT;

      move.score = this.checkMoveState(player, OPPONENT);

      if(move.score === -10){
        console.log("in lose state");
        this.board[emptyCells[i]] = move.cell;
        return move;
      }

      this.board[emptyCells[i]] = move.cell;
    }

    //here iterate through moves[] to find out the best move in order to find the path to win.
    for(let i=0; i<moves.length; i++){
      let currCell = moves[i];
      this.board[currCell.cell] = player;
      let availSpots = this.getEmptyCells();

      for(let j=0; j<availSpots.length; j++){
        let move = {};

        move.cell = this.board[availSpots[j]];
  
        this.board[availSpots[j]] = player;
        
        move.score = this.checkMoveState(player, OPPONENT);
        if(move.score === 10){
          this.board[availSpots[j]] = move.cell;
          this.board[currCell.cell] = currCell.cell;
          return move;
        }else{
          let freeSpaces = this.getEmptyCells();

          for(let f=0; f<freeSpaces.length; f++){
            let secondMove = {};
      
            secondMove.cell = this.board[freeSpaces[f]];
      
            this.board[freeSpaces[f]] = player;
            
            secondMove.score = this.checkMoveState(player, OPPONENT);
            if(secondMove.score === 10){
              this.board[freeSpaces[f]] = secondMove.cell;
              this.board[availSpots[j]] = move.cell;
              this.board[currCell.cell] = currCell.cell;
              return secondMove;
            }
            this.board[freeSpaces[f]] = secondMove.cell;
          }
        }
        this.board[availSpots[j]] = move.cell;
      }
      this.board[currCell.cell] = currCell.cell;
    }
    return moves[0];
  };
}

module.exports = Game;
