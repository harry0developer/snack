import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponentRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomeComponentRoutingModule
  ],
  declarations: [HomeComponent]
})
export class HomeComponentModule {}
