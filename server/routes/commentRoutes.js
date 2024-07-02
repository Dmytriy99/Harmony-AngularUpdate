const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/:postId/comment", verifyToken, commentController.createComment);
router.get("/:postId/comment", verifyToken, commentController.getComment);
// Altre rotte per i commenti

module.exports = router;
