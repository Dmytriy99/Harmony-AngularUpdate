const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

exports.register = async (req, res) => {
  try {
    // controllo inserimento dati e controllo email valida
    if (!req.body.email) {
      return res.status(400).send("Email is required.");
    }

    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send("Invalid email format.");
    }

    if (!req.body.name) {
      return res.status(400).send("Name is required.");
    }

    if (!req.body.password) {
      return res.status(400).send("Password is required.");
    }

    if (!req.body.gender) {
      return res.status(400).send("Gender is required.");
    }

    // controllo se l'email è gia esistente
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }],
    });
    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      gender: req.body.gender,
    });

    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Error registering user.");
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      // ottenere email key insensitive
      email: { $regex: new RegExp(req.body.email, "i") },
    });
    if (!user) return res.status(404).send({ message: "User not found." });
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid)
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Invalid password" });
    user.status = "online";
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token: token, user: user });
  } catch (error) {
    res.status(500).send("Error logging in" + error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.status = "offline";
    await user.save();
    res.status(200).send({ message: "Logout successful." });
  } catch {
    res.status(500).send("Error updating user information.");
  }
};
