import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SoketService {
  private socket: Socket;
  constructor() {
    // this.socket = io('http://localhost:3000'); // Connessione unica
    this.socket = io('https://harmony-1.onrender.com');

    this.socket.on('connect', () => {
      console.log('🔗 Connesso al server Socket.IO con ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnesso dal server');
    });
  }

  getSocket(): Socket {
    return this.socket;
   }
}
