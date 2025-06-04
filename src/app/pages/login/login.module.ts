import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginComponentRoutingModule } from './login-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    NgOtpInputModule,
    LoginComponentRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginComponentModule {}
