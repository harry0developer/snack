import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonRange, IonTitle, IonToggle, IonToolbar } from '@ionic/angular/standalone';
import { APP_ROUTES, STORAGE } from 'src/app/commons/conts';
import { User } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { AnimationLoader, AnimationOptions, provideLottieOptions } from 'ngx-lottie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
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
  // providers: [
  //   provideLottieOptions({
  //     player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
  //   }),
  //   AnimationLoader,
  // ],
})
export class MatchComponent{
  swiper!: User;
  swipee!: User;

  // options: AnimationOptions = {    
  //   path: '/assets/fireworks.json'  
  // };  
  
  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router) { }

  
  openChats() {}

  onAnimate(): void {    
    console.log("Animating...");  
  }

  continueSwipping() {
    return this.modalCtrl.dismiss(null, 'swipe');
  }

  startChatting() {
    this.modalCtrl.dismiss(null, APP_ROUTES.CHAT);
    // this.router.navigate([APP_ROUTES.CHAT, this.user._id, {user: JSON.stringify(this.user)}])
  }
}
