import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ACCOUNT_TYPE, STORAGE } from 'src/app/commons/conts';
import { AuthService } from 'src/app/commons/services/auth.service';
import { SignupPhoneModalPage } from 'src/app/pages/signup-phone-modal/signup-phone-modal.component';
import moment from 'moment';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: false

})
export class OtpComponent  implements OnInit {
  enteredOtp: any;
  error: string = '';
  @Input() phoneNumber: string = '';
  @Input() otpExpiresAt!: Date;
  @Input() otp: string = '';

  isValid: boolean = false;
  remainingSeconds: number = 0;
  intervalId: any;


  otpFG!: FormGroup;
  constructor(
    private authService: AuthService, 
    private router: Router,
        private formBuilder: FormBuilder,
    private modalCtrl: ModalController) {}
  
  ngOnInit() {
    this.otpFG = this.formBuilder.group({
        otpControl: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]))
    });

    this.remainingSeconds = this.calculateRemainingSeconds();
    this.intervalId = setInterval(() => {
      this.remainingSeconds = this.calculateRemainingSeconds();
    }, 1000);
  }
 

  goToSignIn(){
    this.router.navigateByUrl('login')
  }

 
  
   verifyOtp() { 

    const otp = this.otpFG.value.otpControl;

    const expAt = moment(this.otpExpiresAt);
    const today = moment(new Date(Date.now() + 5 * 60 * 1000));

    if (expAt.isBefore(today) && otp === this.otp) {
      this.modalCtrl.dismiss(null, 'verified');
            
    } else {
      this.error = 'Invalid or expired OTP';
    }
    

   }


  calculateRemainingSeconds(): number {

    const now = new Date(Date.now()).toLocaleString('en-US', {
      timeZone: 'Europe/London'
    });

    return moment(this.otpExpiresAt).diff(now, 'seconds');
  }

   onOtpChange(event: any){
    this.error = '';
   }

   resendOTP(){
      this.error = '';
       this.authService.storageSave(STORAGE.PHONE_NUMBER, this.phoneNumber);
      const req = {phoneNumber: this.phoneNumber, type:  ACCOUNT_TYPE.PhoneNumber}
  
      this.authService.sendOtp(req).subscribe((res: any) => {
        console.log("OTP SENT", res.otp);
        this.otp = res.otp;
        this.otpExpiresAt = res.otpExpiresAt;
        this.phoneNumber = res.phoneNumber;
        this.error = "OTP sent, please enter the new OTP";
        this.otpFG.reset();
      },
      err => {
        console.log(err);
        this.error = err.error.message
      })
   }


  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
