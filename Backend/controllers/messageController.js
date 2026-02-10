const Message = require("../models/Message");
const User = require("../models/User");


exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      text,
      seen: false,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.markAsSeen = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      { senderId: userId, receiverId: req.userId, seen: false },
      { seen: true }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Message.countDocuments({
      senderId: userId,
      receiverId: req.userId,
      seen: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChatUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).select("senderId receiverId");
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId.toString() !== userId) {
        userIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== userId) {
        userIds.add(msg.receiverId.toString());
      }
    });
    const users = await User.find({
      _id: { $in: Array.from(userIds) },
    }).select("username email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
