//here is the room object that controlls that connects users/user with the game.

const Game = require("./Game");

function Room(x, o, code) {
  this.game = new Game();
  this.x = x;
  this.o = {name:"bot", wins: 0};
  this.code = code;
  this.public = false;
  this.x.setCode(code);

  if (o !== null) {
    this.o = o;
    this.o.setCode(code);
  };

  this.getGame = () => {
    return this.game;
  };

  this.getX = () => {
    return this.x;
  };

  this.getO = () => {
    return this.o;
  };

  this.setO = (user) => {
    this.o = user;
  };

  this.getCode = () => {
    return this.code;
  };

  this.getAccess = () => {
    return this.public;
  };

  this.changeAccess = () => {
    this.public = !this.public;
  };

  this.disconnectO = () => {
    this.o = {name:"bot", wins: 0};
  };

  this.disconnectX = () => {
    this.x = this.o;
  }
}

module.exports = Room;
