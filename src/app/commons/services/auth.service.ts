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

  uploadImages(files: any): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('profileImages', files[i], files[i].name);
    }

    const token = localStorage.getItem(STORAGE.AUTH_TOKEN); // Get the JWT token

    return this.http.post(`${this.apiUrl}/upload-images`, formData, {
      headers: {
        Authorization: token ? token : '',
      },
    });
  }

  uploadImage(image: any, uid: any ): Observable<any> {
    let images: string[] = [];
    images.push(image);
    const data = {uid, images};
    return this.http.post(`${this.apiUrl}/upload`,  data);

  }

  updateImages(images: any[], uid: string): Observable<any> {
    const data = {uid, images};
    return this.http.put(`${this.apiUrl}/update-images/${uid}`,  data);
  }

  updateProfilePic(profilePic: string, uid: string): Observable<any> {
    const data = {uid, profilePic};
    return this.http.put(`${this.apiUrl}/update-profile-picture/${uid}`,  data);
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
    localStorage.removeItem(STORAGE.USER);
  }


}
