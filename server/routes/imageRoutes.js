const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const userController = require("../controllers/userController");
const router = express.Router();

// Rotta per caricare un'immagine
router.post("/upload", upload.single("image"), userController.updatePhoto);

// Rotta per recuperare un'immagine
router.get("/:id", userController.getUserImage);

module.exports = router;