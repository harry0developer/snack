import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { STORAGE } from 'src/app/commons/conts';
import { AuthService } from 'src/app/commons/services/auth.service';
import { SignupPhoneModalPage } from 'src/app/signup-phone-modal/signup-phone-modal.component';
import moment from 'moment';
import { ACCOUNT_TYPE } from 'src/app/commons/model';

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
  // phoneNumber: string = '';

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
    })
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
      
    
    // this.modalCtrl.dismiss(this.otp, 'verified');
    // if (this.otp === this.enteredOtp && new Date() < this.otpExpiresAt) {
    //    //otp verified
    // } else {
    //   this.error = 'Invalid or expired OTP'
    //  }

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
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

}
