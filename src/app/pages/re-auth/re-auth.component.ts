import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { STORAGE } from 'src/app/commons/conts';
import { User } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { CountryCodeComponent } from '../country-code/country-code.component';
import { Router } from '@angular/router';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';

@Component({
  selector: 'app-re-auth',
  templateUrl: './re-auth.component.html',
  styleUrls: ['./re-auth.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ReAuthComponent implements OnInit {
  password: string = '';
  error: string = '';
  dob: string = '';
  name: string = '';
  code: string = '';

  selectedCountryCode: string = '';
  validations_form!: FormGroup;
  passcodeFormGroup!: FormGroup;

  user!: User;

  phoneFormValidationMessages = {
    'passcode': [
      { type: 'required', message: 'Passcode is required.' },
      { type: 'minlength', message: 'Passcode must be 6 characters long.' },
      { type: 'maxlength', message: 'Passcode must be 6 characters long.' }

    ]
  };



  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,

    private modalCtrl: ModalController,
    private router: Router) { }

  ngOnInit() {
    this.user = this.authService.storageGet(STORAGE.ME);
    this.error
    console.log("User ", this.user);
    this.passcodeFormGroup = this.formBuilder.group({
      passcode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }



  get passcode() {
    return this.passcodeFormGroup.controls['passcode'].value;
  }

  async getCurrentPosition() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log("Perms", permissionStatus.location);
      if (permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus?.location != 'granted') {
          return;
        }

      }
      let options: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }

      const postions = await Geolocation.getCurrentPosition(options);
      console.log("Position", postions);

      return;
    } catch (error) {
      console.log(error);
      return
    }

  }




  login() {

    this.authService.login(this.user.phoneNumber).subscribe(
      (response: any) => {
        console.log('User logged in successfully', response);
        this.authService.saveToken(response.token);
        this.authService.storageSave(STORAGE.ME, response.user);
        this.router.navigate(['/protected']);
      },
      (error) => {
        console.error('Error logging in', error);
        this.error = "Invalid passcode";
      }
    );
  }

  resetLogin() {
    this.router.navigateByUrl('login')
  }

  async openCountryCodeModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeComponent,
      componentProps: {
        "code": this.code
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("applied", data);
      this.selectedCountryCode = data.dial_code;
    }
  }

  goToCreateAccount() {
    this.router.navigateByUrl('create-account');
  }

}
