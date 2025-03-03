import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5001/api/users'; 
 
  constructor(private http: HttpClient) {}
 

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); 
  }
  
}
