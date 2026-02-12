const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
  markAsSeen,
  getUnreadCount,
  getChatUsers,
} = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);
router.get("/chats", authMiddleware, getChatUsers);
router.get("/:userId", authMiddleware, getMessages);
router.put("/seen/:userId", authMiddleware, markAsSeen);
router.get("/unread/:userId", authMiddleware, getUnreadCount);

module.exports = router;
