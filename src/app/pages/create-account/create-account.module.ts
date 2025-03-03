import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateAccountComponentRoutingModule } from './create-account-routing.module';
import { CreateAccountComponent } from './create-account.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CreateAccountComponentRoutingModule
  ],
  declarations: [CreateAccountComponent]
})
export class CreateAccountComponentModule {}
