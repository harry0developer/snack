import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { APP_ROUTES, STORAGE } from 'src/app/commons/conts';
import { Country, OTP, User } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { CountryCodeComponent } from '../country-code/country-code.component';
import { OtpComponent } from '../otp/otp.component';
import { ErrorModalPage } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false

})
export class LoginComponent implements OnInit {

  password: string = '';
  dob: string = '';
  name: string = '';
  code: string = '';

  selectedCountryCode: string = '';
  validations_form!: FormGroup;
  loginFormGroup!: FormGroup;

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
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      phone: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
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
      const phoneNumber = this.loginFormGroup.controls['code'].value + this.loginFormGroup.controls['phone'].value;

      this.authService.login(phoneNumber).subscribe((res: any) => {
        console.log(res);
        this.authService.saveToken(res.token); 
        this.authService.storageSave(STORAGE.ME, res.user); 
        this.router.navigate(['/protected']);
      }, err => {
        console.log("LOGIN error ", err);
        
      })
     
    }
  }

  async login() {
    const signinLoading = await this.loadingCtrl.create({ message: "Signing you in..." });
    await signinLoading.present();

    const phoneNumber = this.loginFormGroup.controls['code'].value + this.loginFormGroup.controls['phone'].value;

    this.authService.userExists(phoneNumber).subscribe((res: any) => {
      console.log(res);
      signinLoading.dismiss();
      this.sendOTP(phoneNumber);
    }, err => {
      console.log(err);
      const error = { title: "Login failed", content: err.error.message};
      this.showErrorModal(error)
      signinLoading.dismiss();
    });
   
  }

  async sendOTP(phoneNumber: string) {
    const otpLoading = await this.loadingCtrl.create({ message: "Sending OTP..." });
    await otpLoading.present();
     this.authService.sendOtp(phoneNumber).subscribe((res: any) => {
      otpLoading.dismiss();
      console.log("OTP SENT", res.otp);
    
      this.presentOTPModal(res);
      
    }, err => {
        otpLoading.dismiss();
        console.log(err);
      })
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


  async showErrorModal(error: any) {
    const modal = await this.modalCtrl.create({
      component: ErrorModalPage,
      backdropDismiss: false,
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
      componentProps: {
        title: error.title,
        content: error.content
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
 
  onPasscodeChange(evn: any){
    console.log(evn);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

}
