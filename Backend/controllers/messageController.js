const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");
const { getReceiverSocketId } = require("../socket/socket");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      text,
      seen: false,
    });

    const sender = await User.findById(req.userId).select("username");
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      const io = req.app.get("io");
      io.to(receiverSocketId).emit("receiveMessage", {
        _id: message._id,
        senderId: req.userId,
        senderUsername: sender.username,
        receiverId,
        text,
      });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId },
      ],
    };

    const totalMessages = await Message.countDocuments(query);
    
    // We reverse the sort to grab the *latest* messages first when skipping
    // Then we reverse them back to chronological order (oldest -> newest) for the UI
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      messages: messages.reverse(),
      hasMore: totalMessages > skip + messages.length,
      page
    });
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

    // Use MongoDB Aggregation to securely and quickly find unique chat partners
    const uniqueUserIds = await Message.aggregate([
      // Stage 1: Match every message where the user is either sender or receiver
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      // Stage 2: We want the "other" person's ID, not our own. 
      // We use $cond (if-else condition) to figure out who the other person is.
      {
        $project: {
          contactId: {
            $cond: {
              if: { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              then: "$receiverId",
              else: "$senderId"
            }
          }
        }
      },
      // Stage 3: Group by this new "contactId" list so they are all unique (like a JS Set)
      {
        $group: {
          _id: "$contactId"
        }
      }
    ]);

    // uniqueUserIds returns an array of documents shaped like { _id: "some_user_id" }
    // We map it to a simple array of IDs
    const contactIds = uniqueUserIds.map((u) => u._id);

    // Fetch the actual user objects using this unique array
    const users = await User.find({
      _id: { $in: contactIds },
    }).select("username email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
