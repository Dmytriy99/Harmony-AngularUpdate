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




////////////////////////////////////////////////////////////////
//RICHIESTE DI AMICIZIA




  exports.sendFriendRequest = async (req, res) => {
    console.log("Ricevuta richiesta:", req.body.userId); // Aggiungi questo log
    console.log("Ricevuta richiesta:", req.userId); // Aggiungi questo log
    try {
      const senderId = req.userId;
      const  receiverId  = req.body.userId;
  
      if (senderId === receiverId) {
        return res.status(400).send("Non puoi inviare una richiesta a te stesso.");
      }
  
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).send("Utente non trovato.");
      }
  
      // if (receiver.friendRequests.some(senderId)) {
      //   return res.status(400).send("Richiesta già inviata.");
      // }
      const alreadyRequested = receiver.friendRequests.some(req => req.userId.toString() === senderId);
    if (alreadyRequested) {
      return res.status(400).send("Richiesta già inviata.");
    }
  
      if (receiver.friends.includes(senderId)) {
        return res.status(400).send("Siete già amici.");
      }
      console.log("user", sender.name); // Aggiungi questo log
      receiver.friendRequests.push({ userId: senderId, name: sender.name });
      sender.sentRequests.push(receiverId);

      await receiver.save();
      await sender.save();
  
      res.status(200).send();
    } catch (error) {
      res.status(500).send("Errore nell'invio della richiesta di amicizia.");
    }
  };
  exports.acceptFriendRequest = async (req, res) => {
    try {
      const receiverId = req.userId;
      const senderId  = req.body.userId;
      console.log("Ricevuta richiesta:", req.body.userId); // Aggiungi questo log
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);
  
      if (!receiver || !sender) {
        return res.status(404).send("Utente non trovato.");
      }
  
      const requestExists = receiver.friendRequests.some(req => req.userId.toString() === senderId);
      if (!requestExists) {
        return res.status(400).send("Nessuna richiesta di amicizia trovata.");
      }
  
      // Aggiungere agli amici
      receiver.friends.push(senderId);
      sender.friends.push(receiverId);
  
      // Rimuovere la richiesta dalla lista delle richieste in sospeso
      receiver.friendRequests = receiver.friendRequests.filter(
        (id) => id.userId.toString() !== senderId
      );

      receiver.sentRequests = receiver.sentRequests.filter(id => id.toString() !== senderId);

      // 🔥 Rimuovere l'ID del destinatario dalla lista delle richieste inviate del mittente
      sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

      sender.friendRequests = sender.friendRequests.filter(
        (id) => id.userId.toString() !== receiverId
      );

  
      await receiver.save();
      await sender.save();
  
      res.status(200).send("Richiesta di amicizia accettata.");
    } catch (error) {
      res.status(500).send("Errore nell'accettare la richiesta di amicizia.");
    }
  };
  exports.rejectFriendRequest = async (req, res) => {
    try {
      const receiverId = req.userId;
      const { senderId } = req.body;
  
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);
  
      if (!receiver) {
        return res.status(404).send("Utente non trovato.");
      }
  
      receiver.friendRequests = receiver.friendRequests.filter(
        (id) => id.toString() !== senderId
      );
      // 🔥 Rimuovere l'ID del destinatario dalla lista delle richieste inviate del mittente
      sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);
  
      await receiver.save();
      await sender.save();
  
      res.status(200).send("Richiesta di amicizia rifiutata.");
    } catch (error) {
      res.status(500).send("Errore nel rifiutare la richiesta di amicizia.");
    }
  };
  exports.removeFriend = async (req, res) => {
    try {
      const userId = req.userId;
      const { friendId } = req.body;
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).send("Utente non trovato.");
      }
  
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
      friend.friends = friend.friends.filter((id) => id.toString() !== userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).send("Amico rimosso con successo.");
    } catch (error) {
      res.status(500).send("Errore nel rimuovere l'amico.");
    }
  };

  exports.getFriendsList = async (req, res) => {
    try {
      const userId = req.body.userId;
  
      const user = await User.findById(userId).populate("friends", "name email");
  
      if (!user) {
        return res.status(404).send("Utente non trovato.");
      }
  
      res.status(200).json(user.friends);
    } catch (error) {
      res.status(500).send("Errore nel recuperare la lista amici.");
    }
  };
;

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