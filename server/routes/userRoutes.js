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

router.post("/send-friend-request", verifyToken, userController.sendFriendRequest);
router.post("/accept-friend-request", verifyToken, userController.acceptFriendRequest);
router.post("/reject-friend-request", verifyToken, userController.rejectFriendRequest);
router.post("/remove-friend", verifyToken, userController.removeFriend);
router.post("/friends", verifyToken, userController.getFriendsList);


module.exports = router;
