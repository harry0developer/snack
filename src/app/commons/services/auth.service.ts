import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { STORAGE } from '../conts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';  

  constructor(private http: HttpClient) {}

  register(username: string, password: string, name: string, dob: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, name, dob });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

 
  storageSave(key: string, data: any): void {
    const saveData = JSON.stringify(data);
    localStorage.setItem(key, saveData)
  }

  storageGet(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  uploadImages(files: any): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('profileImages', files[i], files[i].name);
    }

    const token = localStorage.getItem('authToken'); // Get the JWT token

    return this.http.post(`${this.apiUrl}/upload-images`, formData, {
      headers: {
        Authorization: token ? token : '',
      },
    });
  }


  sendOtp(phoneNumber: string) {
    const user = {
      username: 'me@test.com',
      password: "qwerty",
      name: "Harry Smith",
      dob: "12/12/1995",
      phoneNumber,
      otp: "",
      otpExpiresAt: ""
    }
    return this.http.post(`${this.apiUrl}/send-otp`, user);
  }

  verifyOtp(phoneNumber: string, otp: string) {
    const otpReq = {
      phoneNumber,
      otp
    }
    return this.http.post(`${this.apiUrl}/verify-otp`, otpReq);
  }

  logout(): void {
    localStorage.removeItem(STORAGE.AUTH_TOKEN);
    localStorage.removeItem(STORAGE.ME);
    localStorage.removeItem(STORAGE.USER);

  }


}
