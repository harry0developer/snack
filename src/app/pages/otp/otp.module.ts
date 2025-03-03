import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpComponentRoutingModule } from './otp-routing.module';
import { OtpComponent } from './otp.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OtpComponentRoutingModule
  ],
  declarations: [OtpComponent]
})
export class OtpComponentModule {}
