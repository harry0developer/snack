import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/commons/services/auth.service';

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

  phoneNumber: string = '';


  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
  }

  createAccount() {
    this.authService.register(this.username, this.password, this.name, this.dob).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error registering user', error);
      }
    );
  }

  sendOtp() {
          this.authService.storageSave("phone", this.phoneNumber)
this.router.navigateByUrl('otp')
    // this.authService.sendOtp(this.phoneNumber).subscribe((res) => {
    //   console.log("Send ", res);
    //   this.authService.storageSave("phone", this.phoneNumber)
    // },err => console.log(err))
  }


  goToSignIn(){
    this.router.navigateByUrl('login')
  }

}
