const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const http = require("http");
const socket = require("./soket"); // Importa il file Socket.IO
const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database: ", err);
    process.exit(1);
  });

socket.init(server); // Inizializza Socket.IO con il server HTTP

// server.listen(PORT, () => console.log("Server avviato su porta 3000"));