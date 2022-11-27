const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const router = require("./routes/routes.js");
const { Server } = require("socket.io");
const Message = require("./DataStructure/Message.js");
const io = new Server(server);

app.get("/", router);

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});