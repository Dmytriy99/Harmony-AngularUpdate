const mongoose = require("mongoose");
const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model/user.model.js");
const Post = require("./model/post.model.js");
const Comment = require("./model/comment.model.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "http://localhost:4200", // Sostituisci con il tuo URL frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specifica i metodi HTTP consentiti
    allowedHeaders: ["Content-Type", "Authorization"], // Specifica le intestazioni personalizzate consentite
  })
);
app.use(bodyParser.json());
// app.get("/api", (req, res) => {
//   res.send("hello form node");
// });

app.post("/api", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://Dima:080399xD@database.qmkgzej.mongodb.net/?retryWrites=true&w=majority&appName=DataBase"
  )
  .then(() => {
    console.log("connetted to database");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  });
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }
  jwt.verify(token, "your_secret_key", function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token.", token });
    }
    req.userId = decoded.id;
    next();
  });
}

app.post("/api/post", verifyToken, async (req, res) => {
  try {
    req.body.userId = req.userId;
    const post = await Post.create(req.body);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    // Hash della password dell'utente
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Crea un nuovo utente nel database con la password hashata
    const user = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      gender: req.body.gender,
    });
    // Genera un token di autenticazione per l'utente appena registrato
    const token = jwt.sign({ id: user._id }, "your_secret_key", {
      expiresIn: 86400, // Il token scade in 24 ore
    });
    // Invia il token come risposta
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    // In caso di errore, restituisci un messaggio di errore
    res.status(500).send("Error registering user.");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      // Se l'utente non è trovato, restituisci un errore 404
      return res.status(404).send("User not found.");
    }

    // Verifica la correttezza della password
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log("Password valida:", passwordIsValid);
    if (!passwordIsValid) {
      // Se la password non è valida, restituisci un errore 401
      return res.status(401).send({ auth: false, token: null });
    }

    //aggiorna lo stato dell'utente a "online"
    user.status = "online";
    await user.save();
    // Se l'utente è autenticato con successo, genera un token di autenticazione
    const token = jwt.sign({ id: user._id }, "your_secret_key", {
      expiresIn: 86400, // Il token scade in 24 ore
    });
    // Invia il token come risposta
    res.status(200).send({ auth: true, token: token });
  } catch (error) {
    console.error("Errore durante il login:", error);
    // In caso di errore, restituisci un messaggio di errore
    res.status(500).send("Error logging in" + error.message);
  }
});

app.get("/api/user/userinfo", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error getting user info.");
  }
});

app.get("/api/post", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const post = await Post.find().skip(skip).limit(limit).sort({ _id: -1 });
    //const reversedPost = post.reverse();
    const totalPosts = await Post.countDocuments();
    res.status(200).json({
      post,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const name = req.query;
    // const email = req.query;
    const { page = 1, limit = 10, name, email } = req.query;
    const skip = (page - 1) * limit;
    // Crea un oggetto query vuoto
    let query = {};

    // Aggiungi i filtri alla query se i parametri sono forniti
    if (name) {
      query.name = { $regex: `^${name}`, $options: "i" }; // Cerca il nome, case insensitive
    }

    if (email) {
      query.email = { $regex: `^${email}`, $options: "i" }; // Cerca l'email, case insensitive
    }

    const user = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: -1 });
    const totalUser = await User.countDocuments(query);
    //console.log("Users retrieved:", user);
    res.status(200).json({
      user,
      totalUser,
      totalPages: Math.ceil(totalUser / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/post/:postId/like", verifyToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.likedBy.includes(userId)) {
      return res.status(400).send("You have already liked this post");
    }

    post.likedBy.push(userId);
    post.likes += 1;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/user/logout", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.status = "offline";

    await user.save();
    res.status(200).send({ message: "Logout successful." });
  } catch {
    res.status(500).send("Error updating user information.");
  }
});

app.patch("/api/user/updateDetails", verifyToken, async (req, res) => {
  try {
    const { name, email, gender, age, description, password } = req.body;
    const userId = req.userId;

    // Trova l'utente nel database per ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Aggiorna le informazioni dell'utente con i nuovi dati forniti

    if (name !== undefined && name.trim() !== "") {
      user.name = name;
    }

    if (email !== undefined && email.trim() !== "") {
      user.email = email;
    }
    if (gender !== undefined && gender.trim() !== "") {
      user.gender = gender;
    }
    if (age !== undefined && age.trim() !== "") {
      user.age = age;
    }

    if (description !== undefined && description.trim() !== "") {
      user.description = description;
    }
    if (password !== undefined && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    res.status(200).send({ message: "User information updated successfully." });
  } catch (error) {
    res.status(500).send("Error updating user information.");
  }
});

app.patch(
  "/api/user/updatePhoto",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.userId;

      // Trova l'utente nel database per ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found.");
      }

      if (req.file) {
        user.image.data = req.file.buffer;
        user.image.contentType = req.file.mimetype;
      } else {
        return res.status(400).send("No image file uploaded");
      }
      // Salva le modifiche nel database
      await user.save();

      res.status(200).send({ message: "User Photo updated successfully." });
    } catch (error) {
      res.status(500).send("Error updating user Photo.");
    }
  }
);

app.get("/api/user/:id/image", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.image || !user.image.data) {
      return res.status(200).json({ message: "Image not found." });
    }

    res.set("Content-Type", user.image.contentType);
    res.send(user.image.data);
  } catch (error) {
    res.status(500).send("Error retrieving image.");
  }
});

app.post("/api/post/:postId/comment", verifyToken, async (req, res) => {
  try {
    const content = req.body.content;
    const postId = req.params.postId;
    const userId = req.userId;

    // Controlla se il post esiste
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    //ottieni il nome e email dell'utente autenticato

    const user = await User.findById(userId);
    const name = user.name;
    const email = user.email;

    // Crea il commento associato al post
    const comment = await Comment.create({
      content: content,
      userId: userId,
      postId: postId,
      name: name,
      email: email,
    });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/post/:postId/comment", async (req, res) => {
  try {
    const postId = req.params.postId;

    // Trova i commenti associati al post
    const comments = await Comment.find({ postId: postId });
    const reversedComments = comments.reverse();

    res.status(200).json(reversedComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/post/:userId/post", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId: userId });
    const reversedPost = posts.reverse();
    // if (posts.length === 0) {
    //   return res.status(404).json({ message: "No posts found for this user." });
    // }

    res.status(200).json(reversedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
