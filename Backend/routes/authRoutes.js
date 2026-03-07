const express = require("express");
const router = express.Router();
const { register, login,searchUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;
