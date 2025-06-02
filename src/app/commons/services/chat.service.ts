import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5001/api/chats'; 
  // private apiUrl = 'https://snuggle.onrender.com/api';
  constructor(private http: HttpClient) {}
 

  getChatHistory(uid1: string, uid2: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${uid1}/${uid2}`);
  }

 
}
