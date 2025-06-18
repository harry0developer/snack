import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5001/api/users'; 
  constructor(private http: HttpClient) {}
 

  getUsers(currentUserId: string, userIds: string[]): Observable<any>{
    const req = {
      currentUserId,
      userIds
    }
    return this.http.post<any>(`${this.apiUrl}/matched-users`, req);
  }
  
 
}
