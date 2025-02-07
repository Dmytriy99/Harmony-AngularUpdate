const { Server } = require("socket.io");

let io;

let activeUsers = 0;

const onlineUsers = new Map();

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "*", // Permetti richieste da tutti i domini (modifica se necessario)
      },
    });

    io.on("connection", (socket) => {
      activeUsers++;
      console.log(`Utente connesso: ${socket.id} | Totale utenti: ${activeUsers}`);

      // Registra l'utente con il suo userId
      socket.on("registerUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`Utente ${userId} registrato con socketId: ${socket.id}`);
      });

      // Rimuove l'utente dalla mappa quando si disconnette
      socket.on("disconnect", () => {
        activeUsers--;
        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            console.log(`Utente ${userId} disconnesso, socketId rimosso`);
            break;
          }
        }
        console.log(`Utente disconnesso: ${socket.id} | Totale utenti: ${activeUsers}`);
      });
    });
    // io.on("connection", (socket) => {
    //   activeUsers++;
    //   // console.log("Un utente si è connesso:", socket.id);
    //   console.log(`Utente connesso: ${socket.id} | Totale utenti: ${activeUsers}`);
    //   socket.on("disconnect", () => {
    //     activeUsers--;
    //     console.log("Un utente si è disconnesso");
    //   });
    // });
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io non è inizializzato!");
    }
    return io;
  },
  getOnlineUsers: () => onlineUsers,
};