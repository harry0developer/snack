import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { STORAGE } from 'src/app/commons/conts';
import { Country } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { CountryCodeComponent } from '../country-code/country-code.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false

})
export class LoginComponent  implements OnInit {

  username: string = '';
  password: string = '';
  error: string = '';
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

    private modalCtrl: ModalController,
    private router: Router) {}

  ngOnInit() {
    console.log();

    this.loginFormGroup = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  
      code: ['', [Validators.required]],  
      passcode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

 

  get passcode() {
    return this.loginFormGroup.controls['passcode'].value;
  }

  // ngOnInit() {
  //   const token = this.authService.getToken();

  //   if(token) {
  //     this.router.navigateByUrl('tabs/tab1');
  //   }
  // }

  login() {
    const p = this.loginFormGroup.controls['code'].value + this.loginFormGroup.controls['phone'].value;

    console.log("phone",p)
    const data = {
      phoneNumber:  p,
      passcode: this.passcode
    };


    this.authService.login(data).subscribe(
      (response: any) => {
        console.log('User logged in successfully', response);
        this.authService.saveToken(response.token); 
        this.authService.storageSave(STORAGE.ME, response.user); 
        this.router.navigate(['/protected']);
      },
      (error) => {
        console.error('Error logging in', error);
        this.error = error.error.message;
      }
    );
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
