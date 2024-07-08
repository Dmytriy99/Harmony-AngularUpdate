const User = require("../model/user.model");

exports.getUserLogInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error getting user info.");
  }
};

exports.getAllUser = async (req, res) => {
  try {
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
};

exports.getUserById = async (req, res) => {
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
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { name, email, gender, age, description, password, address } =
      req.body;
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
    if (address !== undefined && address.trim() !== "") {
      user.address = address;
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
};

exports.updatePhoto = async (req, res) => {
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
};

exports.getUserImage = async (req, res) => {
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
};
