import { Component, OnInit } from '@angular/core';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader,
   IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRange, 
   IonTitle, IonToggle, IonToolbar, IonItemDivider } from '@ionic/angular/standalone';

import { Preferences, AgeRange } from '../preferences/preferences.component';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../commons/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/commons/model';
import { SafetyTipsComponent } from 'src/app/safety-tips/safety-tips.component';
import { SupportComponent } from 'src/app/support/support.component';
import { TermsComponent } from 'src/app/terms/terms.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput, IonRange,
    IonItem,
    IonModal,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
    IonAvatar, IonIcon, IonToggle,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonItemDivider
  ],
  standalone: true
})
export class SettingsComponent  implements OnInit {
  name!: string;
  user!: User;
  wantList: string[] = [];
  withList: string[] = [];
 
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private authService: AuthService 
  ) {
  }

  ngOnInit() {
    console.log(this.user);

  }

  async openPreferencesModal() {
    // const modal = await this.modalCtrl.create({
    //   component: PreferencesModalPage,
    //   componentProps: {
    //     "user": this.user
    //   }
    // });
    // modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // if (role === 'save') {
    //   console.log("applied");
    // }
  }

  async presentActionSheet() {
    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Deactivate account',
    //   buttons: [
    //     {
    //       text: 'Deactivate',
    //       role: 'destructive',
    //       data: {
    //         action: 'deactivate',
    //       },
    //       handler: () => { this.logout() }
    //     }, 
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       data: {
    //         action: 'cancel',
    //       },
    //     },
    //   ],
    // });

    // await actionSheet.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
 

  async openModal(compRef: any) {
    const modal = await this.modalCtrl.create({
      component: compRef,
      componentProps: {
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  openTermsAndConditionsModal() {
    this.openModal(TermsComponent);
  }

  openSafetyTipsModal() {
    this.openModal(SafetyTipsComponent);
  }

  openSupportModal() {
    this.openModal(SupportComponent);
  }


  async logout() {
    this.modalCtrl.dismiss().then(() => {
      this.authService.logout();
      this.router.navigateByUrl('re-login')
    })
  }
}