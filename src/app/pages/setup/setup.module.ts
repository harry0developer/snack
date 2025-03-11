import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupComponentRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SetupComponentRoutingModule
  ],
  declarations: [SetupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SetupComponentModule {}
