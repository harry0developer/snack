import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import {IonContent,IonButton, IonSearchbar, 
  IonButtons, IonItem, IonSpinner, IonList,
  IonHeader, IonToolbar,
  IonLabel, ModalController} from '@ionic/angular/standalone';

import { debounceTime } from 'rxjs/operators';
import { DataService } from 'src/app/commons/services/data.service';

@Component({
  selector: 'app-country-code',
  templateUrl: './country-code.component.html',
  styleUrls: ['./country-code.component.scss'], 
  imports: [
    IonItem,
    IonList,
    IonButton,
    IonButtons,
    IonLabel,
    IonHeader,
    IonSpinner,
    IonSearchbar,
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ModalController]

})
export class CountryCodeComponent   {
  countries: any = [];

  searchControl: FormControl;
  searching: any = false; 
  searchTerm: string = '';
  items: any;
  flags: any;

  
  constructor( 
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dataService: DataService) {
    this.searchControl = new FormControl();
  } 

 
 
  async ionViewWillEnter() {
    const loadingCountryCode = await this.loadingCtrl.create({ message: "Loading, please wait..." });
    await loadingCountryCode.present();
    this.dataService.getCountries().forEach((c: any) => {
      this.countries = c;  
      loadingCountryCode.dismiss();
    }).catch(err => {
      console.log(err);
      loadingCountryCode.dismiss();
      
    })

    this.setFilteredItems();      
    this.searchControl.valueChanges
    .pipe(debounceTime(400)
    ).subscribe(search => {
      this.searchTerm = search
        this.searching = false;
        this.setFilteredItems();
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {
    this.countries = this.dataService.filterItems(this.searchTerm);
  }

  selectCountry(country: any) {
    this.modalCtrl.dismiss(country, 'save');
  }

  confirm() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
 

}
