import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonTitle,
  IonToolbar,
  IonLabel, 
  IonList, IonRange,IonToggle,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle ,
  IonAvatar, IonIcon, 
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { Range } from '../commons/model';

export interface AgeRange { 
  min: number, max: number, pin: boolean, lower: number, upper: number
}

export interface Preferences {
  distance: number,
  age: {
    lower: number,
    upper: number
  };
  photos: number;
  ageOutOfBound: boolean;
  distanceOutOfBound: boolean;
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput, IonRange,
    IonItem,
    IonModal,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
    IonAvatar, IonIcon, IonToggle,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle 
  ],
})
export class PreferencesComponent  implements OnInit {
  preferences!: Preferences;

  distanceRange: Range = { 
    min: 0, max: 100, value: 22, pin: true
  }

  ageRange: AgeRange = { 
    min: 18, max: 100, pin: true, lower: 20, upper: 45
  }

  minNumberOfPhotos = { 
    min: 1, max: 6, value: 1, pin: true
  }

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.preferences);
    this.distanceRange.value = this.preferences.distance;
    this.ageRange.lower = this.preferences.age.lower;
    this.ageRange.upper = this.preferences.age.upper;
    this.minNumberOfPhotos.value = this.preferences.photos;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.preferences, 'confirm');
  }


  handleDistanceRangeChange(event: any) {
    this.distanceRange.value = event.detail.value;
    this.preferences.distance = event.detail.value;
  }

  handleAgeRangeChange(event: any) {
    this.ageRange.lower = event.detail.value.lower;
    this.ageRange.upper = event.detail.value.upper;
    this.preferences.age.lower = event.detail.value.lower;
    this.preferences.age.upper = event.detail.value.upper;
  }

  handleMinNumberOfPhotoChange(event: any) {
    this.minNumberOfPhotos.value = event.detail.value;
    this.preferences.photos = event.detail.value;

  }

  profileOutOfRangeChange(event: any) {
    console.log('Profile ', event.detail.checked);
    this.preferences.ageOutOfBound = event.detail.checked;
  }

  distanceOutOfRangeChange(event: any) {
    console.log('Distance ', event.detail.checked);
    this.preferences.distanceOutOfBound = event.detail.checked;
  }

}
