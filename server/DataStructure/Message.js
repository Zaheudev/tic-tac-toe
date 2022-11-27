// datastructure for sending data between client and server.

function Message(type, data) {
  this.type = type;
  this.data = data;
}

module.exports = Message;
