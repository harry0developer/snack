import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { STORAGE } from '../conts';
import { TempUser, User } from '../model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';  

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password: string, name: string, dob: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, name, dob });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username: data.phoneNumber,  phoneNumber: data.phoneNumber, password: data.passcode  });
  }

  saveToken(token: string): void {
    localStorage.setItem(STORAGE.AUTH_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE.AUTH_TOKEN);
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
 
  uploadImage( formData: any) {
    return this.http.post(`${this.apiUrl}/upload`,  formData);
  }

  getImages(uid: string) {
    return this.http.get(`${this.apiUrl}/images/${uid}`);
  }

  deleteImage(uid: string, filename: string) {
    return this.http.delete(`${this.apiUrl}/images/${uid}/${filename}`);
  }
  
  getImageData(uid: string, filename: string) {
    return this.http.get(`${this.apiUrl}/image/${uid}/${filename}`, {
       responseType: 'blob'
    }); 
  }

  updateProfilePic(user: User){
    return this.http.put(`${this.apiUrl}/users/${user._id}`, user);
  }


  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`); 
  }
 
  updateSwipeCollection(swiperId: string, swipeeId: string, direction: string): Observable<any> {
   const req = { swiperId, swipeeId, direction};
    return this.http.post<any>(`${this.apiUrl}/swipe`, req); 
  }

  sendOtp(otpRequest: any) {
    return this.http.post(`${this.apiUrl}/send-otp`,  otpRequest);
  }

  createAccount(user: User) {
    return this.http.post(`${this.apiUrl}/create-account`,  user);
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
    // localStorage.removeItem(STORAGE.ME);
  }


}
