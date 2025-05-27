const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const communityController = require("../controllers/communityController");


router.post("/communitiesList", verifyToken, communityController.getCommunites);
router.post("/createCommunity", verifyToken, communityController.createCommunity);
// router.patch("/:postId/like", verifyToken, postController.postLike);
// router.get("/", verifyToken, postController.getPost);
// router.get("/:userId/post", verifyToken, postController.getPostById);
// router.delete("/:postId", verifyToken, postController.delatePost);
// router.post("/:postId/image",upload.single('image'),verifyToken, postController.updatePostImage);
// router.get("/:postId/image/:imageId", postController.getPostImage);

module.exports = router;
