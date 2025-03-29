import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { LoadingComponent } from '../components/loading/loading.component';
import { NoUsersComponent } from '../components/no-users/no-users.component';
import { PreferencesComponent } from '../pages/preferences/preferences.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    LoadingComponent,
    NoUsersComponent,
    PreferencesComponent
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
