import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { STORAGE } from '../conts';
import { TempUser, User } from '../model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';

  // private apiUrl = 'https://snuggle.onrender.com/api';
  constructor(private http: HttpClient, private router: Router) { }

 
  login(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { phoneNumber });
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

 showBlob(blob: any) {
    const entries = blob.getAll('files');
    console.log('BLOB UID', blob.getAll('uid'));
    entries.forEach((entry: any, idx: number) => {
      console.log(`BLOB File ${idx}:`, {
        name: entry.name || '(no name)',
        type: entry.type,
        size: entry.size,
      });
    });

  }
  
  uploadImages(formData: any, uid: string) {
    this.showBlob(formData);
    const headers = new HttpHeaders({
      'x-uid': uid,
    });
    return this.http.post(`${this.apiUrl}/upload-multiple/uid=${uid}`, formData, { headers });

  }

  uploadImage(formData: any, uid: string) {
    this.showBlob(formData);
    return this.http.post(`${this.apiUrl}/upload/uid=${uid}`, formData);
  }
  // getImages(uid: string) {
  //   return this.http.get(`${this.apiUrl}/images/${uid}`);
  // }

  deleteImage(uid: string, filename: string) {
    return this.http.delete(`${this.apiUrl}/images/${uid}/${filename}`);
  }

  getImageData(uid: string, filename: string) {
    return this.http.get(`${this.apiUrl}/image/${uid}/${filename}`, {
      responseType: 'blob'
    });
  }

  updateUser(user: User) {
    return this.http.put(`${this.apiUrl}/users/${user._id}`, user);
  }

  getUsers(user: User): Observable<any> {
    const req = {...user}
 
    return this.http.post<any>(`${this.apiUrl}/users`, req);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  getSwipes(id: string | undefined): Observable<any> {
    console.log("SWIPED ", id);
    
    return this.http.get<any>(`${this.apiUrl}/swipe/${id}`);
  }

  updateSwipeCollection(swiperId: string, swipeeId: string, direction: string): Observable<any> {
    const req = { swiperId, swipeeId, direction };
    return this.http.post<any>(`${this.apiUrl}/swipe`, req);
  }

  sendOtp(phoneNumber: string) {
    return this.http.post(`${this.apiUrl}/send-otp`, {phoneNumber});
  }

  userExists(phoneNumber: string) {
    return this.http.post(`${this.apiUrl}/user-exists`, {phoneNumber});
  }

  createAccount(user: User) {
    return this.http.post(`${this.apiUrl}/create-account`, user);
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
  }

  saveLocalUser(user: User) {
    this.storageSave(STORAGE.ME, user);
  }

}
