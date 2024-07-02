const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", verifyToken, userController.getAllUser);
router.get("/userinfo", verifyToken, userController.getUserLogInfo);
router.get("/:id", verifyToken, userController.getUserById);
router.get("/:id/image", userController.getUserImage);
router.patch("/updateDetails", verifyToken, userController.updateUserDetails);
router.patch(
  "/updatePhoto",
  verifyToken,
  upload.single("image"),
  userController.updatePhoto
);
// Altre rotte per gli utenti

module.exports = router;
