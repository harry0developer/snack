import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { GestureController, Gesture, GestureDetail, ModalController, LoadingController } from '@ionic/angular';
import { Preferences, PreferencesComponent } from '../pages/preferences/preferences.component';
import { AuthService } from '../commons/services/auth.service';
import { PREFERENCE, SEXUAL_ORIENTATION, STORAGE } from '../commons/conts';
import { Router } from '@angular/router';
import { ImageBlob, NotFound, User } from '../commons/model';
import { UtilService } from '../commons/services/util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatchComponent } from '../pages/match/match.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit, OnInit {

  opacityHeart: number = 0;
  opacityClose: number = 0;

  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;

  opacity: number = 1;
  currentIndex: number = 0;
  swipeDirection: string = '';
  rotateAngle: number = 0;
  noMoreUsers: boolean = false;

  showNoMoreUsers: boolean = false;
  loadingUsers: boolean = false;


  users: User[] = [];
  currentUser!: User
  currentUserProfilePicture: any;
  swipeeProfilePicture: any;
  cards: any;

  preferences: Preferences = {
    distance: 60,
    age: {
      lower: 21,
      upper: 45
    },
    photos: 1,
    ageOutOfBound: false,
    distanceOutOfBound: false
  }

  notFound: NotFound = {
    icon: 'assets/icons/chats.svg',
    title: 'Keep swipping',
    body: 'Your matches will appear here where you can send them a message'
  }

  constructor(
    private gestureCtrl: GestureController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController,
    private cdRef: ChangeDetectorRef) { }


  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      this.router.navigateByUrl('login');
    }
    this.currentUser = this.authService.storageGet(STORAGE.ME);
    console.log("Current user ", this.currentUser);

    if (!this.currentUserProfilePicture) {
      this.authService.getImageData(this.currentUser._id!, this.currentUser.profilePic).subscribe((blob: any) => {
        const objectURL = URL.createObjectURL(blob);
        const bob: ImageBlob = {
          img: this.sanitizer.bypassSecurityTrustUrl(objectURL),
          filename: this.currentUser.profilePic
        }
        this.currentUserProfilePicture = bob.img.changingThisBreaksApplicationSecurity;
        console.log("currentUserProfilePicture ", this.currentUserProfilePicture);

      }, err => console.log(err))
    }

    // this.getUsers();
  }

  ngAfterViewInit() {
    this.loadingUsers = true;
    setTimeout(() => {
      this.initializeGestures();
      this.cdRef.detectChanges();
      this.loadingUsers = false;
    }, 2000);
  }

  async getUsers() {
     
    this.loadingUsers = true;
    this.authService.getUsers().subscribe((users: any) => {
     
      if (this.currentUser.preferences.with === PREFERENCE.EITHER) {
        this.users = users.filter((u: User) => u._id !== this.currentUser._id && (u.preferences.with === PREFERENCE.EITHER || u.sexualOrientation === SEXUAL_ORIENTATION.GAY))
      } else {
        this.users = users.filter((u: User) => u._id !== this.currentUser._id && this.currentUser.preferences.with === u.gender);
      }

      console.log("users ", this.users);

      if (this.users && this.users.length > 0) {
        this.users.forEach((u, i) => {
          const userImages = u.images;
          this.users[i].images = [];
          userImages.forEach((filename: string) => {
            this.authService.getImageData(this.currentUser._id!, filename).subscribe((blob: any) => {
              const objectURL = URL.createObjectURL(blob);
              const bob: ImageBlob = {
                img: this.sanitizer.bypassSecurityTrustUrl(objectURL),
                filename
              }
              this.users[i].images.push(bob.img.changingThisBreaksApplicationSecurity);
              this.loadingUsers = false;

            }, err => {
              console.log(err);
              this.loadingUsers = false;
            });
          });
        });
      }
      
    }, err => this.loadingUsers = false  );
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: PreferencesComponent,
      componentProps: {
        preferences: this.preferences
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('modal confirm... clicked');
      console.log("Data model ", data);
      this.preferences = data
    }
  }

  initializeGestures() {
    this.cards = document.querySelectorAll('.swipe-card');
    console.log('cards ', this.cards);

    this.cards.forEach((card: any, index: number) => {
      const gesture: Gesture = this.gestureCtrl.create({
        el: card,
        gestureName: 'swipe',
        onMove: (detail: GestureDetail) => this.onCardMove(detail, index),
        onEnd: (detail: GestureDetail) => this.onCardEnd(detail, index),
      });

      gesture.enable();
    });
  }

  onCardMove(detail: GestureDetail, index: number) {

    const card = document.querySelectorAll('.swipe-card')[index] as HTMLElement;
    const offsetX = detail.deltaX;
    const rotation = detail.deltaX > 0 ? 'rotate(30deg)' : 'rotate(-30deg)';

    const closeOp = Math.min(Math.max(offsetX / window.innerWidth, 0), 1);
    const heartOp = Math.min(Math.max(-offsetX / window.innerWidth, 0), 1);

    this.opacityClose = closeOp > 0 ? closeOp + 0.5 : 0;
    this.opacityHeart = heartOp > 0 ? heartOp + 0.5 : 0;

    this.cdRef.detectChanges();

    const moveX = Math.min(Math.max(offsetX, -window.innerWidth / 2), window.innerWidth / 2);
    card.style.transform = `translateX(${moveX}px) ${rotation}`;
  }

  onCardEnd(detail: GestureDetail, index: number) {
    const card = document.querySelectorAll('.swipe-card')[index] as HTMLElement;
    const offsetX = detail.deltaX;

    this.opacityClose = 0;
    this.opacityHeart = 0;
    this.cdRef.detectChanges();

    if (Math.abs(offsetX) > window.innerWidth / 4) {

      // If swiped to the right, move off screen to the right
      if (offsetX > 0) {
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = `translateX(${window.innerWidth}px)`;
        this.onSwipeRight(index);
      }
      // If swiped to the left, move off screen to the left
      else {
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = `translateX(-${window.innerWidth}px)`;
        this.onSwipeLeft(index);
      }
    } else {
      // Reset card if not swiped enough
      card.style.transition = 'transform 0.3s ease-out';
      card.style.transform = 'translateX(0)';
    }

  }

  onSwipeRight(index: number) {
    const swipee = this.getNodeValue(this.cards[index]);
    this.updateSwipedCollection(index, swipee, 'right');
  }

  onSwipeLeft(index: number) {
    const swipee = this.getNodeValue(this.cards[index]);
    this.updateSwipedCollection(index, swipee, 'left');
  }

  private updateSwipedCollection(index: number, swipee: string, direction: string) {
    this.authService.updateSwipeCollection(this.currentUser._id!, swipee, direction).subscribe((res: any) => {
      //do some
      console.log("SWipe res ", res);

      if (res.match) {

        this.authService.getImageData(res.swipee._id!, res.swipee.profilePic).subscribe((blob: any) => {
          const objectURL = URL.createObjectURL(blob);
          const bob: ImageBlob = {
            img: this.sanitizer.bypassSecurityTrustUrl(objectURL),
            filename: this.currentUser.profilePic
          }
          res.swipee.profilePic = bob.img.changingThisBreaksApplicationSecurity;
          res.swiper.profilePic = this.currentUserProfilePicture;

          this.openMatchModal(res.swiper, res.swipee);
          this.removeCard(index);

        }, err => console.log(err))
      }


    }, err => {
      console.log("Swipe failed ", err);
    })
  }

  async openMatchModal(swiper: User, swipee: User) {
    const modal = await this.modalCtrl.create({
      component: MatchComponent,
      componentProps: {
        swiper,
        swipee,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('modal confirm... clicked');
      console.log("Data model ", data);
    }
  }

  getNodeValue(node: any): string {
    const card = node;

    if (card) {
      const images = card.querySelectorAll('img');
      const imageAlts = Array.from(images).map((img: any) => img.getAttribute('alt') || '');
      console.log(imageAlts[0]);
      return imageAlts[0];
    } else {
      console.warn('Card not found.');
      return '';
    }
  }

  removeCard(index: number) {
    setTimeout(() => {
      console.log("removeCard ", this.cards);
      console.log("removeCard index", index);

      // this.cards.splice(index, 1);
      this.showNoMoreUsers = index < 1;
      this.cdRef.detectChanges();
    }, 300); // Delay removal until the transition completes
  }

  handleNoMoreUsersChange(event: any) {
    console.log("No more user ", event);
    this.loadingUsers = true;
    this.users = [];
    setTimeout(() => {
      this.initializeGestures();
      this.loadingUsers = false;
      this.showNoMoreUsers = false;
      this.getUsers();
    }, 1000);
    this.cdRef.detectChanges();

  }

}