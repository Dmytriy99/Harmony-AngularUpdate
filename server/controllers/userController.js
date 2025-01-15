const User = require("../model/user.model");
const Image = require("../model/image.model");

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
    let query = {};

    // filtri alla query
    if (name) {
      query.name = { $regex: `^${name}`, $options: "i" }; // Cerca il nome, case insensitive
    }

    if (email) {
      query.email = { $regex: `^${email}`, $options: "i" }; // Cerca l'email, case insensitive
    }
    // ottenimento user dall'ultimo inserito
    const user = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: -1 });
    const totalUser = await User.countDocuments(query);
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

    const user = await User.findById(userId);

    // se non vengono ottentuti input lasciare i dati come erano

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (name !== undefined && name.trim() !== "") {
      user.name = name;
    }

    if (email !== undefined && email.trim() !== "") {
      const emailRegex = /.+\@.+\..+/;
      if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format.");
      }
      // Controllo se l'email è già esistente per un altro utente
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).send("Email already in use.");
      }
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

// exports.updatePhoto = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).send("User not found.");
//     }

//     if (req.file) {
//       user.image.data = req.file.buffer;
//       user.image.contentType = req.file.mimetype;
//     } else {
//       return res.status(400).send("No image file uploaded");
//     }

//     await user.save();

//     res.status(200).send({ message: "User Photo updated successfully." });
//   } catch (error) {
//     res.status(500).send("Error updating user Photo.");
//   }
// };
exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.userId;

    // Trova l'utente
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (!req.file) {
      return res.status(400).send("No image file uploaded.");
    }

    // Crea un nuovo documento immagine
    const newImage = new Image({
      userId,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    // Salva l'immagine nel database
    const savedImage = await newImage.save();

    // Aggiorna l'utente con l'ID dell'immagine
    user.imageId = savedImage._id;
    await user.save();

    res.status(200).send({
      message: "Image uploaded successfully.",
      imageId: savedImage._id,
    });
  } catch (error) {
    res.status(500).send("Error uploading image.");
  }
};

// exports.getUserImage = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user || !user.image || !user.image.data) {
//       return res.status(200).json({ message: "Image not found." });
//     }

//     res.set("Content-Type", user.image.contentType);
//     res.send(user.image.data);
//   } catch (error) {
//     res.status(500).send("Error retrieving image.");
//   }
//};
exports.getUserImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Trova l'immagine nel database
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).send("Image not found.");
    }

    // Imposta il tipo di contenuto e invia l'immagine
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).send("Error retrieving image.");
  }
};