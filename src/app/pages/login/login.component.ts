import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE } from 'src/app/commons/conts';
import { AuthService } from 'src/app/commons/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const token = this.authService.getToken();

    if(token) {
      this.router.navigateByUrl('tabs/tab1');
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
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
  goToCreateAccount() {
    this.router.navigateByUrl('create-account');
  }
 
}
