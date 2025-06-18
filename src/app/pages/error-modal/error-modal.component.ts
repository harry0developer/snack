import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import {
  IonButton, IonButtons, IonCard, IonDatetime, IonFooter,
  IonIcon, IonContent, IonCol, IonHeader, IonInput, IonItem,
  IonLabel, IonSelect, IonSelectModal, IonSelectOption, IonRange, IonRow, IonGrid, IonImg
} from '@ionic/angular/standalone';
import { Filesystem } from '@capacitor/filesystem';

import moment from 'moment';
import { User } from '../../commons/model';
import { AuthService } from '../../commons/services/auth.service';
import { APP_ROUTES, STORAGE } from '../../commons/conts';
import { Camera, CameraResultType, CameraSource, GalleryPhotos } from '@capacitor/camera';
import { PhotoService } from 'src/app/commons/services/photo.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonCard,
    IonIcon,
    IonCol,
    IonRange,
    IonGrid,
    IonRow,
    IonImg,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ErrorModalPage implements OnInit {

  @Input() title: string = '';
  @Input() content: string = '';
   
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private presentToast: ToastController,
    private loadingCtrl: LoadingController,
    private photoService: PhotoService
  ) {  }

  ngOnInit(): void {}
  
  dismiss() {
    this.modalCtrl.dismiss();
  }
}