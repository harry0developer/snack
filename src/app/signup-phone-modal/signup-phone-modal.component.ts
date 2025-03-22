import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController} from '@ionic/angular';

import { IonButton, IonButtons, IonCard, IonDatetime, IonFooter, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectModal, IonSelectOption,  } from '@ionic/angular/standalone';
 
import moment from 'moment';
import { User } from '../commons/model';
import { AuthService } from '../commons/services/auth.service';
import { APP_ROUTES, STORAGE } from '../commons/conts';

@Component({
  selector: 'app-signup-phone-modal',
  templateUrl: './signup-phone-modal.component.html',
  styleUrls: ['./signup-phone-modal.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectModal,
    IonSelectOption,
    IonDatetime,
    IonCard,
    IonFooter,
    CommonModule,ReactiveFormsModule

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
 
  profilePicture: string = '';
  user: any;
  currentUser: any;
  uploadedImages: any;
  code: string = '';
  verificationCodeError: string = "";
  selectedDate: any;
  minDate: any;
  maxDate: any;

  verificationCode: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController
  ) { } 

  
  get name() {
    return this.userFormGroup.get('name')?.value;
  }

  get dob() {
    return this.userFormGroup.get('dob')?.value;
  }

  get gender() {
    return this.userFormGroup.get('gender')?.value;
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
      sexualOrientation: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bodyType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      preferenceFor: new FormControl('', Validators.compose([
        Validators.required
      ])),
      preferenceWith: new FormControl('', Validators.compose([
        Validators.required
      ])),
      passcode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ])),
    });
  
  }


  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }

	next() {
		++this.activeStep;
	}
 
  setMaxDate() {
    const m = moment().subtract(18, 'years');
    const mm = moment().subtract(100, 'years');
    this.minDate = mm.format();
    this.maxDate = m.format();
    this.selectedDate = m.format();    
  }

  async createAccount() {
    console.log(this.userFormGroup.value);
    const f = this.userFormGroup.value;
    const phone = this.authService.storageGet(STORAGE.PHONE_NUMBER);
    const user: User = {
      name: f.name,
      dob: moment(f.dob).format("DD-MM-YYYY"),
      age: moment().diff(f.dob, 'years'),
      gender: f.gender,
      phoneNumber: phone,
      username: phone,
      password: f.passcode,
      ethnicity: f.ethnicity,
      bodyType: f.bodyType,
      sexualOrientation: f.sexualOrientation,
      interests: [],
      preferences: {
        ethnicity: [],
        age: {
          lower: 18,
          upper: 55
        },
        want: f.preferenceFor,
        with: f.preferenceWith,
        distance: 100
      }
    }

    console.log("API READY DATA ", user);

    this.authService.createAccount(user).subscribe((res: any) => {
      console.log("Response ", user);
      this.modalCtrl.dismiss().then(() => {
        this.authService.login(user.username, user.password).subscribe((auth) => {
          this.router.navigateByUrl(APP_ROUTES.HOME);
          this.authService.storageSave(STORAGE.AUTH_TOKEN, auth.token);
          this.authService.storageSave(STORAGE.USER, auth)
        }, err => {
          console.log(err);
          
        })
      })
    }, err => {
      console.log(err.error);
      
    })
    
  }
   
  async stepOne() { 
    const loading = await this.loadingCtrl.create({message: "Checkng email.."});
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
    this.code = ""+Math.floor(Math.random()*100000+1);
    console.log("Cocde: ", this.code);

  }

  cancelCreateAccount() {
    this.router.navigateByUrl('ROUTES.SIGNUP', {replaceUrl: true})
  } 

  otpController(event: any, next: any, prev: any) {
    if(isNaN(event.target.value)) {
      event.target.value = "";
      return 0;
    } else {
      if (event.target.value.length < 1 && prev) {
        prev.setFocus();
        return 0;
      } else if (next && event.target.value.length > 0) {
        next.setFocus();
        return 0;
      } else {
        return 0;
      }
    }
  }

}