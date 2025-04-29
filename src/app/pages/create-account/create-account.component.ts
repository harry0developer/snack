import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/commons/services/auth.service';
import { CountryCodeComponent } from '../country-code/country-code.component';
import { Country, OTP } from 'src/app/commons/model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ACCOUNT_TYPE, STORAGE } from 'src/app/commons/conts';
import { SignupPhoneModalPage } from 'src/app/pages/signup-phone-modal/signup-phone-modal.component';
import { OtpComponent } from '../otp/otp.component';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: false
})
export class CreateAccountComponent  implements OnInit {
  username: string = '';
  dob: string = '';
  name: string = '';
  password: string = '';
  error: string = '';
  code: string = '';
  selectedCountryCode: string = '';


  validations_form!: FormGroup;
  phoneNumberFormGroup!: FormGroup;

 

  phoneFormValidationMessages = {
    'phone': [
     { type: 'required', message: 'Phone number is required.' },
     { type: 'minlength', message: 'Phone number must be at least 9 characters long.' }
    ],
    'passcode': [
     { type: 'required', message: 'Passcode is required.' },
     { type: 'minlength', message: 'Passcode must be 6 characters long.' },
     { type: 'maxlength', message: 'Passcode must be 6 characters long.' }

    ]
  };
 
  country: Country = {
    name: "South Africa",
    flag: "🇿🇦",
    code: "ZA",
    dialCode: "+27"
  };

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder,

    private modalCtrl: ModalController,
    private router: Router) {}
  
  ngOnInit() {
    console.log();

    this.phoneNumberFormGroup = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(9),
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required
      ])),
      // passcode: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(6),
      // ]))
    });
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


  createAccount() { 
    const phone = this.phoneNumberFormGroup.controls['code'].value +  this.phoneNumberFormGroup.controls['phone'].value
    const req = {phoneNumber: phone, type:  ACCOUNT_TYPE.PhoneNumber}
    this.authService.sendOtp(req).subscribe((res: any) => {
      this.authService.storageSave(STORAGE.PHONE_NUMBER, phone);
      this.openOTPModal(res);
    }, err => {
      console.log(err.error);
      
    })
  }
   

  async openOTPModal(phoneAndOtp: OTP) {
    const modal = await this.modalCtrl.create({
      component: OtpComponent,
      componentProps: {
        phoneNumber: phoneAndOtp.phoneNumber,
        otp: phoneAndOtp.otp,
        otpExpiresAt: phoneAndOtp.otpExpiresAt
      },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'verified') {
      this.openCreateAccountModal();
      console.log("All good, create account and, go to profile");
      
    }
  }

  async openCreateAccountModal() {
    const modal = await this.modalCtrl.create({
      component: SignupPhoneModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("confirmed", data);
      // this.sendOtp(this.authService.storageGet(STORAGE.PHONE_NUMBER))
    }
  }

  goToSignIn(){
    this.router.navigateByUrl('login')
  }

}
