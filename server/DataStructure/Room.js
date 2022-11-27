//here is the room object that controlls that connects users/user with the game.

const Game = require("./Game");

function Room(x, o) {
  this.game = new Game();
  this.x = x;
  this.o = "bot";

  if (o !== null) {
    this.o = o;
  }

  this.getX = () => {
    return this.x;
  };

  this.getY = () => {
    return this.y;
  };
}

module.exports = Room;
