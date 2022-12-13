const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000", 
  },
});

let users = [];

const addUser = (userName, socketId) => {
  !users.some((user) => user.userName === userName) && users.push({ userName, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userName) => {
  return users.find((user) => user.userName === userName);
};

const getUserBySocketID = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

io.on("connection", (socket) => {
  //take userName and socketId from user when connected
  socket.on("addUser", (userName) => {
    console.log("user " + userName + " connected.");
    addUser(userName, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderName, receiverName, text }) => {
    const user = getUser(receiverName);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderName,
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    var result_userBySocketID = getUserBySocketID(socket.id);
    if (result_userBySocketID) {
      console.log("user " + result_userBySocketID.userName + " disconnected.");
    }
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
