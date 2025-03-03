import { Component, OnInit } from '@angular/core';
import { AuthService } from '../commons/services/auth.service';
import { Router } from '@angular/router';
import { STORAGE } from '../commons/conts';
import { User } from '../commons/model';
import { LoadingController, ModalController } from '@ionic/angular';
import { SettingsComponent } from '../settings/settings.component';
import { Preferences } from '../preferences/preferences.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit{
  me!:User;
  images: any[] = [
    'assets/profiles/1a.jpg',
    'assets/profiles/1b.jpg',
    'assets/profiles/1c.jpg',
    'assets/profiles/2.jpg'

  ];
  constructor(
    private authService: AuthService, 
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  selectedImages: any[] = [];

  
  preferences: Preferences = {
    distance: 60,
    age: {
      lower: 21,
      upper: 45
    },
    photos: 1,
    ageOutOfBound: false,
    distanceOutOfBound: false
  }

  ngOnInit() {
    this.me = this.authService.storageGet(STORAGE.ME);
    console.log("User ", this.me);
    const token = this.authService.getToken();
    if(!token){
      this.authService.logout();
      this.router.navigateByUrl('login');
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsComponent,
      componentProps: {
        preferences: this.preferences
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('modal confirm... clicked');
      console.log("Data model ", data);
      this.preferences = data
    }
  }


  //TODO UPLOAD IMAGE

  async uploadImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {

      const loading = await this.loadingCtrl.create({message: "Uploading image, please wait..."});
      await loading.present();


    }
  }

}
