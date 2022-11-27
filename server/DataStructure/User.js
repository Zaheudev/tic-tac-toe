// here's the logic for client.

function User(symbol, ws) {
  this.symbol = symbol;
  this.ws = ws;
  this.wins = 0;
}

module.exports = User;
