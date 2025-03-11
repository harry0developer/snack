import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flags, Message } from '../model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public http: HttpClient) {}
  countries: any = [];
  flags: any = [];

  getCountries() {
    this.http.get('assets/country-codes.json').forEach((c: any) => {
      this.countries = c;   
    });
  }

  getFlags(){
    return this.http.get('assets/flags.json') as Observable<Flags>;
  }
   
  filterItems(searchTerm: string) {    
    return this.countries.filter((item: any) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
