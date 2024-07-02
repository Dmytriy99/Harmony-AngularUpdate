require("dotenv").config(); // Carica le variabili d'ambiente da .env

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};
module.exports = connectDB;
