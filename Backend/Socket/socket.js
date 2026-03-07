const onlineUserSockets = {};

const getReceiverSocketId = (receiverId) => {
  return onlineUserSockets[receiverId];
};

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user comes online
    socket.on("userConnected", (userId) => {
      onlineUserSockets[userId] = socket.id;
      io.emit("onlineUsers", Object.keys(onlineUserSockets));
    });

    // typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUserSockets[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", senderId);
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      for (let userId in onlineUserSockets) {
        if (onlineUserSockets[userId] === socket.id) {
          delete onlineUserSockets[userId];
        }
      }
      io.emit("onlineUsers", Object.keys(onlineUserSockets));
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket, getReceiverSocketId };
