import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpComponentRoutingModule } from './otp-routing.module';
import { OtpComponent } from './otp.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    OtpComponentRoutingModule
  ],
  declarations: [OtpComponent]
})
export class OtpComponentModule {}
