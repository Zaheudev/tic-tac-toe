// here's the logic for client.

function User(symbol, name, code) {
  this.symbol = symbol;
  this.name = name;
  this.wins = 0;
  this.roomCode = code;

  this.getSymbol = () => {
    return this.symbol;
  }

  this.getWins = () => {
    return this.wins;
  }

  this.getName = () => {
    return this.name;
  }

  this.getCode = () => {
    return this.roomCode;
  }

  this.setCode = (code) => {
    this.roomCode = code;
  }

  this.won = () => {
    this.wins++;
  }
}

module.exports = User;
