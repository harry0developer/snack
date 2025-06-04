import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
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
  dob: string = '';
  name: string = '';
  password: string = '';
  error: string = '';
  code: string = '';
  selectedCountryCode: string = '';


  validations_form!: FormGroup;
  createAccountFormGroup!: FormGroup;

 

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
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router) {}
  
  ngOnInit() {
    this.createAccountFormGroup = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(9),
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required
      ]))
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
 

  async openCreateAccountModal(phoneNumber: string) {
    const modal = await this.modalCtrl.create({
      component: SignupPhoneModalPage,
      componentProps: {
        "phoneNumber": phoneNumber
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("confirmed", data);
    }
  }

  async sendOTP(phoneNumber: string) {
    const loading = await this.loadingCtrl.create({ message: "Sending OTP..." });
    await loading.present();
     this.authService.sendOtp(phoneNumber).subscribe((res: any) => {
      loading.dismiss();
      console.log("OTP SENT", res.otp);
    
      this.presentOTPModal(res);
      
    }, err => {
        loading.dismiss();
        console.log(err);
        this.error = err.error.message
      })
  }
  
  async presentOTPModal(otpData: OTP) {
    const modal = await this.modalCtrl.create({
      component: OtpComponent,
      backdropDismiss: false,
      breakpoints: [0, 0.7],
      initialBreakpoint: 0.7,
      componentProps: {
        otpData
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'verified') {
      const phoneNumber = this.createAccountFormGroup.controls['code'].value + this.createAccountFormGroup.controls['phone'].value;
      this.openCreateAccountModal(phoneNumber);
    }
  }

  async createAccount() { 
    const loading = await this.loadingCtrl.create({ message: "Verifying your phone number..." });
    await loading.present();

    const phoneNumber = this.createAccountFormGroup.controls['code'].value + this.createAccountFormGroup.controls['phone'].value;

    this.authService.userExists(phoneNumber).subscribe((res: any) => {
      console.log(res);
      loading.dismiss();
      this.error = "Provided phone number has an active account";
    }, err => {
      console.log(err);
      loading.dismiss();
      this.sendOTP(phoneNumber);

    });
 
  }

  goToSignIn(){
    this.router.navigateByUrl('login')
  }

}
