const express = require("express");
const router = express.Router();
const { register, login, getUsers,searchUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getUsers);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;
