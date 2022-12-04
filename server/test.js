// this is only to test the mechanics.
const Game = require("./DataStructure/Game.js");

let game = new Game();

game.setCell(0,"O");
game.setCell(0,"O");
game.setCell(game.bestChoice("X").cell, "X");

console.log(game.getBoard());