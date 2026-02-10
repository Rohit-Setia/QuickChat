const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
  markAsSeen,
  getUnreadCount,
} = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);
router.put("/seen/:userId", authMiddleware, markAsSeen);
router.get("/unread/:userId", authMiddleware, getUnreadCount);

module.exports = router;
