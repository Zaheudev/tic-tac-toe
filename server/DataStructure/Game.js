// here stands the logic for the game
// letter "O" stands for human and letter "X" stands for bot if it's a singleplayer game

function Game() {
  this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.corners = [0,2,6,8];
  this.movesCounter = 0;
  this.firstMove = null;

  this.getBoard = () => {
    return this.board;
  };

  this.setCell = (cell, user) => {
    this.board[cell] = user;
    if(this.movesCounter === 0){
      this.firstMove = {cell: cell, player: user};
    }
    this.movesCounter++;
  };

  this.getEmptyCells = () => {
    return this.board.filter(i => i !== "O" && i !== "X");
  };

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

  this.checkState = (player, opponent) => {
    if(this.checkWinning(opponent)){
      return -10;
    }else if(this.checkWinning(player)){
      return 10;
    }else{
      return 0;
    }
  }

  this.bestChoice = (player) => {
    let emptyCells = this.getEmptyCells();
    let moves = [];
    const OPPONENT = player === "X" ? "O" : "X";

    if(this.movesCounter === 1 && this.corners.find(e => e === this.firstMove.cell) !== undefined){
      return {cell: 4, score: 0};
    }

    //here checks if the 'player' is in win state and if not insert all possible moves in a array to iterate later to find best move
    for(let i=0; i<emptyCells.length; i++){
      let move = {};

      move.cell = this.board[emptyCells[i]];

      this.board[emptyCells[i]] = player;
      
      move.score = this.checkState(player, OPPONENT);
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

      move.score = this.checkState(player, OPPONENT);

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
        
        move.score = this.checkState(player, OPPONENT);
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
            
            secondMove.score = this.checkState(player, OPPONENT);
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
