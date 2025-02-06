const { Server } = require("socket.io");

let io;

let activeUsers = 0;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "*", // Permetti richieste da tutti i domini (modifica se necessario)
      },
    });

    io.on("connection", (socket) => {
      activeUsers++;
      // console.log("Un utente si è connesso:", socket.id);
      console.log(`Utente connesso: ${socket.id} | Totale utenti: ${activeUsers}`);
      socket.on("disconnect", () => {
        activeUsers--;
        console.log("Un utente si è disconnesso");
      });
    });
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io non è inizializzato!");
    }
    return io;
  },
};