const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const imageRoutes = require("./routes/imageRoutes");
const communityRoutes = require("./routes/communityRoutes");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server!!");
});
app.use("/api/user", userRoutes);
app.use("/api", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post", commentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/community", communityRoutes);

module.exports = app;
