import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ACCOUNT_TYPE, STORAGE } from 'src/app/commons/conts';
import { AuthService } from 'src/app/commons/services/auth.service';
import moment from 'moment';
import { OTP } from 'src/app/commons/model';
 
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: false

})
export class OtpComponent  implements OnInit {
  enteredOtp: any;
  error: string = '';
  otpExpired: boolean = false;
  @Input() otpData: OTP = {
    phoneNumber: '',
    otp: '',
    otpExpiresAt: ''
  };

  isValid: boolean = false;
  remainingSeconds: number = 0;
  intervalId: any;


  otpFG!: FormGroup;
  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) {}
  
  ngOnInit() {
    console.log("Passed otp ", this.otpData);
    
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
      if(this.remainingSeconds <= 0) {
        this.otpExpired = true;
      }
    }, 1000);
  }
 

  goToSignIn(){
    this.router.navigateByUrl('login')
  }

  verifyOtp() { 
    const otp = this.otpFG.value.otpControl;
    const expAt = moment(this.otpData.otpExpiresAt);
    const today = moment(new Date(Date.now() + 5 * 60 * 1000));

    if (expAt.isBefore(today) && otp === this.otpData.otp) {
      this.modalCtrl.dismiss(null, 'verified');
    } else {
      this.error = 'Invalid or expired OTP';
    }
  }

  calculateRemainingSeconds(): number {
    console.log(this.otpData);
    
    const now = new Date(Date.now()).toLocaleString('en-US', {
      timeZone: 'Europe/London'
    });
    return moment(this.otpData.otpExpiresAt).diff(now, 'seconds');
  }

   onOtpChange(event: any){
    this.error = '';
   }

   async resendOTP(){
      const loading = await this.loadingCtrl.create({ message: "Validating the OTP.." });
      await loading.present();
      
      this.error = '';
       this.authService.storageSave(STORAGE.PHONE_NUMBER, this.otpData.phoneNumber);
  
      this.authService.sendOtp(this.otpData.phoneNumber).subscribe((res: any) => {
        loading.dismiss();
        console.log("OTP SENT", res.otp);
        this.otpData = res; 
        this.error = "OTP sent, please enter the new OTP";
        this.otpFG.reset();
      },
      err => {
        loading.dismiss();
        console.log(err);
        this.error = err.error.message
      })
   }


  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
