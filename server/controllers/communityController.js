const Community = require("../model/community.model");
const User = require("../model/user.model");

exports.getCommunites = async (req, res) => {
    try {
    const communities = await Community.find().sort({ displayName: 1 });
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCommunity = async (req, res) => {
  try {

    const user = await User.findById(req.userId)

    const { displayName } = req.body;

    const name = displayName.toLowerCase();
    if (!displayName) {
      return res.status(400).json({ message: "Campi obbligatori mancanti" });
    }

    // Assicuriamoci che non esista già
    const existing = await Community.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Community già esistente" });
    }

    const newCommunity = new Community({
      name: displayName.toLowerCase(),
      displayName,
      createdBy: user.userId // oppure req.user._id, dipende da come gestisci auth
    });

    const saved = await newCommunity.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};