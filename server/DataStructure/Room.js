//here is the room object that controlls that connects users/user with the game.

const Game = require("./Game");

function Room(x, o, code) {
  this.game = new Game();
  this.x = x;
  this.x.setCode(code);
  this.code = code;
  this.o = "bot";

  if (o !== null) {
    this.o = o;
    this.o.setCode(code);
  }

  this.getGame = () => {
    return this.game;
  }

  this.getX = () => {
    return this.x;
  };

  this.getO = () => {
    return this.o;
  };

  this.getCode = () => {
    return this.code;
  };
}

module.exports = Room;
