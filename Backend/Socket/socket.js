let onlineUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user comes online
    socket.on("userConnected", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("onlineUsers", Object.keys(onlineUsers));
    });

    // send message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const receiverSocket = onlineUsers[receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", {
          senderId,
          text,
        });
        socket.emit("messageSent");
      }
    }); 

    // typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", senderId);
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      }
      io.emit("onlineUsers", Object.keys(onlineUsers));
      console.log("User disconnected:", socket.id);
    });
  });
};
