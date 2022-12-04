const express = require('express');
const app = express();
const http = require('http');
const Room = require('./DataStructure/Room');
const User = require('./DataStructure/User');
const server = http.createServer(app);

const PORT = 3001;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Here stores all he authenticated users. Map<authToken:string, userObj:User>
var users = new Map();
// Here stores room objects, that are player vs computer. Map<code:string, roomObj:Room>
var rooms = new Map();

//Here's the middleware for the incoming socket connection to check if the connection source is authenticated
io.use((socket, next) => {
  let token = socket.handshake.auth.token; 
  if(!authed(token)){
    console.log("writing data..");
    let user = new User("X", "Tim");
    let room = new Room(user, null, generateCode(6));
    users.set(token, user);
    rooms.set(room.getCode(), room);
    socket.data.user = user;
    socket.data.room = room;
    socket.emit("botRoom", room, user);
  }else{
    //here stands the logic for connecting the new socket to the correct gamesession
    let user = users.get(token);
    let room = rooms.get(user.getCode());
    socket.data.user = user;
    socket.data.room = room;
    socket.emit("botRoom", user, room);
  }
  next();
})

io.on('connection', (socket) => {
  console.log(`Socket with ID ${socket.id} connected`);

  socket.onAny((eventName, ...args) => {
    console.log({type: eventName, data: args});
  });

  socket.on("makeMove", (...args) => {
    let room = socket.data.room;
    if(!room.getGame().checkBoardState()){
     let flag = room.getGame().setCell(parseInt(args[0]), socket.data.user.symbol);
     // here sends the state of the game after the player made move so, if he won or if he did the last move the data on client should update.
     // Atttention. this piece of code will change after the player vs player implementation.
      socket.emit("state", {state: room.getGame().checkBoardState()});

      // if the opponent is bot then do the logic for playing with computer.
      // Attention. this if check only stands if the selected game is the type of Player vs Computer.
      if(room.getO() === "bot" && flag){
        let score = room.getGame().botMove();
        // checks if bot won.
        if(score === 10){
          socket.emit("state", {state: room.getGame().checkBoardState()});
        }
        // sends new board to player.
        socket.emit("updateBoard", room);
      }
    }else{
      //here if it s in win state or draw resets the board and send the new board to player.
      room.getGame().resetBoard();
      socket.emit("updateBoard", room);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket with ID ${socket.id} disconnected from ${reason}`)
  })
});

function authed(token){
  for(const [key] of users){
    if(token === key){
      return true;
    }
  }
  return false;
}

function generateCode(length) {
  let result = "";
  let characters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

server.listen(PORT, () => {
  console.log('listening on '+PORT);
});