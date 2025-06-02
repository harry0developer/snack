import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  // private apiUrl = 'https://snuggle.onrender.com/api';
  //   socket = io('https://snuggle.onrender.com', {
  // });
  private apiUrl = 'http://localhost:5001/api'; 

  socket = io('http://localhost:5001', {
  });
  constructor(private http: HttpClient) {
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }

  sendMessage(sender: string, receiver: string, message: string) {
    this.socket.emit('send-message', { sender, receiver, message });

  }

  receiveMessages() {
    return new Observable((observer) => {
      this.socket.on('receive-message', (data) => {
        observer.next(data);  // Emit the received data
      });
    });
  }

  joinRoom(user1: string, user2: string): void {
    this.socket.emit('join-room', { user1, user2 });
  }

  
}
