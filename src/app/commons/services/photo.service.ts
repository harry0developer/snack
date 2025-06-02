import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhotos } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  constructor(private http: HttpClient) {}
  images: any[] = [];
  async uploadPhotos(result: GalleryPhotos, uid: string) {
    try {
    

      for (const photo of result.photos) {
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('images', blob, `photo-${Date.now()}.jpeg`);

        const uploadResponse = await this.http
          .post(`http://localhost:5001/api/upload-multiple/${uid}`, formData)
          .toPromise();

        console.log('Upload successful:', uploadResponse);
      }
    } catch (error) {
      console.error('Error picking or uploading images:', error);
    }
  
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
