import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
   imports: [
      IonicModule,
      CommonModule
    ]
})
export class SystemPreferencesComponent implements OnInit {

  step: number = 0;

  constructor() { }

  ngOnInit() {
  }
  allow() {
    this.requestLocation();
  }


async requestLocation() {
  try {
    const perm = await Geolocation.requestPermissions();
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);

    // You can also watch position:
    const watchId = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        console.log('Watching position:', position);
      }
    });
    this.step = 1;

  } catch (error) {
    //show error popup
    console.error('Error getting location', error);
  }
};

}
