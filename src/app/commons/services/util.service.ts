 import { Injectable } from '@angular/core';
 import moment from 'moment';

 @Injectable({
   providedIn: 'root',
 })
 export class UtilService {
    getAge(dob: string) {
        return moment().diff(dob, 'years',false);
    }

    getBase64Images(images: string[]): string[] {
      return images.map(img => 'data:image/jpeg;base64, ' + img);
    }

    getBase64Image(image: string): string {
      return 'data:image/jpeg;base64, ' + image;
    }

}