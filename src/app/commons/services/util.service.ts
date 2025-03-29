 import { Injectable } from '@angular/core';
 import moment from 'moment';

 @Injectable({
   providedIn: 'root',
 })
 export class UtilService {
    getAge(dob: string) {
        return moment().diff(dob, 'years',false);
    }
}