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
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
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
export class SignupPhoneModalPage implements OnInit {

  userFormGroup!: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

  validationMessages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' }
    ],
    'dob': [
      { type: 'required', message: 'Date of birth is required.' }
    ],
    'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],
    'ethnicity': [
      { type: 'required', message: 'Ethnicity is required.' }
    ],
    'preference': [
      { type: 'required', message: 'Preference is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'bio': [
      { type: 'required', message: 'Bio is required.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'verificationCode': [
      { type: 'required', message: 'Verification code is required.' },
      { type: 'minlength', message: 'Verification code must be 6 characters long.' },
      { type: 'maxlength', message: 'Verification code must be 6 characters long.' }
    ],
    'passcode': [
      { type: 'required', message: 'Passcode code is required.' },
      { type: 'minlength', message: 'Passcode code must be 6 characters long.' },
      { type: 'maxlength', message: 'Passcode code must be 6 characters long.' }
    ]
  };

  profilePic: string = '';
  profilePicture: string = '';
  currentUser: any;
  uploadedImages: any;
  code: string = '';
  verificationCodeError: string = "";
  selectedDate: any;
  minDate: any;
  maxDate: any;

  verificationCode: string = '';
  formDataForImages = new FormData();
  blobImages: any[] = [];
  deviceId: string = '';

  galleryPhotos!: GalleryPhotos
  @Input() phoneNumber: string = '';

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
  ) {
  }

  get name() {
    return this.userFormGroup.get('name')?.value;
  }

  get dob() {
    return this.userFormGroup.get('dob')?.value;
  }

  get gender() {
    return this.userFormGroup.get('gender')?.value;
  }
  get bio() {
    return this.userFormGroup.get('bio')?.value;
  } 
  get ethnicity() {
    return this.userFormGroup.get('ethnicity')?.value;
  }
  get preferenceFor() {
    return this.userFormGroup.get('preferenceFor')?.value;
  }
  get preferenceWith() {
    return this.userFormGroup.get('preferenceWith')?.value;
  }

  ngOnInit() {

    console.log("phoneNumber ", this.phoneNumber);

    this.setMaxDate();
    this.userFormGroup = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
      ])),
      dob: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
      ethnicity: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bodyType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bio: new FormControl('', Validators.compose([
        Validators.required,
      ])), 
      preferenceFor: new FormControl('', Validators.compose([
        Validators.required
      ])),
      preferenceWith: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }


  back() {
    if (this.activeStep > 0) {
      --this.activeStep;
    }
  }

  next() {
    console.log("Messge ", this.bio);
    ++this.activeStep;
  }

  setMaxDate() {
    const m = moment().subtract(18, 'years');
    const mm = moment().subtract(100, 'years');
    this.minDate = mm.format();
    this.maxDate = m.format();
    this.selectedDate = m.format();
  }

  async stepOne() {
    const loading = await this.loadingCtrl.create({ message: "Checking phone number..." });
    await loading.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  resedCode() {
    this.code = "" + Math.floor(Math.random() * 100000 + 1);
    console.log("Cocde: ", this.code);
  }

  async createAccount() {
    const loadingCreateAccount = await this.loadingCtrl.create({ message: "Creating your account..." });
    await loadingCreateAccount.present();

    const f = this.userFormGroup.value;


    const user: User = {
      name: f.name,
      dob: moment(f.dob).format("DD-MM-YYYY"),
      age: moment().diff(f.dob, 'years'),
      gender: f.gender,
      phoneNumber: this.phoneNumber,
      username: this.phoneNumber,
      ethnicity: f.ethnicity,
      bodyType: f.bodyType,
      bio: f.bio,
      interests: [],
      images: [],
      profilePic: "",
      preferences: {
        ethnicity: [],
        age: {
          lower: 18,
          upper: 55
        },
        want: f.preferenceFor,
        with: f.preferenceWith,
        distance: 100
      },
      settings: {
        deviceId: this.deviceId,
        banned: false,
        verified: false
      }
    }

    console.log("CREATE ACCOUNT", user);

    this.authService.createAccount(user).subscribe(async (res: any) => {
      loadingCreateAccount.dismiss();

      const loadingProfile = await this.loadingCtrl.create({ message: "Setting up your profile..." });
      await loadingProfile.present();

      this.photoService.uploadPhotos(this.galleryPhotos, res._id).then(async (user: any) => {
        loadingProfile.dismiss();
        console.log("Photos uploaded successfully");
        console.log(user);

        const loadingSignin = await this.loadingCtrl.create({ message: "Signing you in..." });
        await loadingSignin.present();
        this.authService.login(res.phoneNumber).subscribe(async (auth: any) => {
          loadingSignin.dismiss();
          this.modalCtrl.dismiss();
          this.authService.storageSave(STORAGE.AUTH_TOKEN, auth.token);
          this.authService.storageSave(STORAGE.ME, auth.user)
          this.router.navigateByUrl(APP_ROUTES.HOME);
        }, err => {
          loadingSignin.dismiss();
          console.log("ERR: this.authService.login(");
          console.log(err);
        })
      }).catch(err => {
        loadingProfile.dismiss();
      })
    }, err => {
      loadingCreateAccount.dismiss();
      console.log("Upload failed:", err);
      console.log("Error message:", err.message);
      console.log("Status:", err.status);

    })


  }

  removeImage(index: number) {
    this.blobImages.splice(index, 1);
  }



  // Upload multiple images
  async uploadImages() {
    const result = await Camera.pickImages({
      quality: 50,
      limit: 5
    });

    if (!result.photos.length) {
      console.log('No images selected');
      return;
    }

    this.galleryPhotos = result;
    result.photos.forEach(p => this.blobImages.push(p.webPath))
    console.log("IMAGES...", result.photos.length);

  }
   

}