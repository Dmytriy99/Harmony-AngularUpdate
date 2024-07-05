const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
// Serve i file statici di Angular
// app.use(express.static(path.join(__dirname, "../dist/angular15")));
app.get("/", (req, res) => {
  res.send("Benvenuto sulla mia applicazione!");
});
app.use("/api/user", userRoutes);
app.use("/api", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post", commentRoutes);

// Catch all other routes e ritorna l'index file di Angular
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/angular15/index.html"));
// });

module.exports = app;
