let onlineUserSockets = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user comes online
    socket.on("userConnected", (userId) => {
      onlineUserSockets[userId] = socket.id;
      io.emit("onlineUserSocketsockets", Object.keys(onlineUserSockets));
    });

    // send message
    socket.on("sendMessage", ({ senderId, senderUsername, receiverId, text }) => {
      const receiverSocket = onlineUserSockets[receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", {
          senderId,
          senderUsername,
          receiverId,
          text,
        });
        socket.emit("messageSent");
      }
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
      io.emit("onlineUserSockets", Object.keys(onlineUserSockets));
      console.log("User disconnected:", socket.id);
    });
  });
};
