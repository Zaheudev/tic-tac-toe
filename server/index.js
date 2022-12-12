const e = require('express');
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
    // here stands the logic for creating a game for the new client connected and connect it accordingly.
    // the logic is in the function below because the same logic is used somewhere else. (To avoid duplicate code)
    createGame(socket);
  }else{
    //here stands the logic for connecting the new socket to the correct gamesession
    let user = users.get(token);
    let room = rooms.get(user.getCode());
    socket.data.user = user;
    socket.data.room = room;
    socket.join(room.getCode());
    socket.emit("initRoom", user, room);
    socket.emit("updateBoard", {room: room, state: room.getGame().checkBoardState()});
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`Socket with ID ${socket.id} connected`);

  socket.onAny((eventName, ...args) => {
    console.log({type: eventName, data: args});
  });

  socket.on("makeMove", (...args) => {
    let room = socket.data.room;
    if(!room.getGame().checkBoardState()){
     // The setCell function bellow can return: false | "O" | "X" | "draw"
     let flag = room.getGame().setCell(parseInt(args[0]), socket.data.user.symbol);
     // This check here is to avoid the executions if the move is invalid.
     console.log(flag);
     if(!flag){
      // if the opponent is bot then do the logic for playing with computer.
      // Attention. this if check only execute if the selected game is the type of Player vs Computer.
      if(room.getO().name === "bot"){
        let score = room.getGame().botMove();
        if(score === 10){
          room.getO().wins++;
        }
      }
    }else if(flag === "X"){
      room.getX().won();
    }
    // sends new board to player.
    io.to(room.getCode()).emit("updateBoard", {room: room, state: room.getGame().checkBoardState()});
    }else{
      //here if it s in win state or draw resets the board and send the new board to players.
      room.getGame().resetBoard();
      io.to(room.getCode()).emit("updateBoard", {room: room, state: room.getGame().checkBoardState()});
    }
  });

  // this event triggers when players wants to make the room publicly so his friend join.
  // Attention. This feature may change in further development.
  socket.on("toggleON", () => {
    rooms.get(socket.data.room.code).changeAccess();
    console.log(`Room ${socket.data.room.code} made public`)
  });

  // this event triggers when players wants to make is room private again after he made it public. Works only if he's alone in room.
  // Attention. This feature may change in further development.
  socket.on("toggleOFF", () => {
    let room = rooms.get(socket.data.room.code);
    if(room.getO() !== 'bot'){
      return;
    }
    rooms.get(socket.data.room.code).changeAccess();
    socket.leave(socket.data.room.code);
    console.log(`Room ${socket.data.room.code} made private`)
  });

  // this event triggers when client wants to join a room completing the form showed on the page.
  socket.on("JoinRoom", (...args) => {
    let room = rooms.get(args[0].code);
    if(!room){
      socket.emit("error", "room doesen't exist");
      return;
    }
    if(!room.getAccess()){
      socket.emit("error", "room is private");
      return;
    }
    if(socket.rooms.has(room.getCode())){
      return;
    }
    //leaves the current room(which is the player vs computer mode), creating a new user and join a the room with the coded he inserted. 
    socket.leave(socket.data.room.code);
    room.getGame().resetBoard();
    socket.join(room.getCode());
    let newUser = new User("O", "Kim", room.getCode());
    socket.data.user = newUser;
    socket.data.room = room;
    users.set(socket.handshake.auth.token, newUser);
    room.setO(newUser);
    io.to(room.getCode()).emit("initRoom", newUser, room);
    console.log(`A user joined room ${room.getCode()}`);
  });

  // this event triggers when client wants to leave a room (by pressing on the button)
  socket.on("leaveRoom", () => {
    let room = socket.data.room;
    if(room){
      let user = socket.data.user;
      //here checks what symbol he got in order to make the correct logic to leave.
      if(user.getSymbol() === "O"){
        // if he's the symbol "O" calls the function bellow which sets the "O" player back to default({name:"bot", wins: 0})
        room.disconnectO();
      }else {
        if(room.getO().name === "bot"){
          // here checks if the second player is bot, if it is exits the function because it will make useless execution on server to make a new room if he's alone there
          return;
        }
        // if he's not alone then the logic will be executed. Resets the board and disconnects the "X" player.
        room.getGame().resetBoard();
        // the function bellow sets the "X" player to the current "O" player, so the secondary player will be now the first player.
        room.disconnectX();
      }
      // leave socket from the current room and creates a new room for him.
      socket.leave(room.getCode());
      createGame(socket);
      // dummy emitter for debugging, will be changed in future implemenations
      io.to(room.getCode()).emit("updateBoard", {room: room, state: room.getGame().checkBoardState()});
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket with ID ${socket.id} disconnected from ${reason}`)
  })
});

// this function checks if the given authentication token from client is already a user in any session.
function authed(token){
  for(const [key] of users){
    if(token === key){
      return true;
    }
  }
  return false;
}

function createGame(socket){
  console.log("writing data..");
  let user = new User("X", "Tim");
  let room = new Room(user, null, generateCode(6));
  users.set(socket.handshake.auth.token, user);
  rooms.set(room.getCode(), room);
  socket.data.user = user;
  socket.data.room = room;
  socket.join(room.getCode());
  socket.emit("initRoom", room, user);
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