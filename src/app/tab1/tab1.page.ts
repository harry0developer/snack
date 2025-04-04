import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { GestureController, Gesture, GestureDetail, ModalController } from '@ionic/angular';
import { Preferences, PreferencesComponent } from '../pages/preferences/preferences.component';
import { AuthService } from '../commons/services/auth.service';
import { STORAGE } from '../commons/conts';
import { Router } from '@angular/router';
import { User } from '../commons/model';
import { UtilService } from '../commons/services/util.service';
import { UserService } from '../commons/services/user.service';
 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit, OnInit{
   
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


  me!: User;

  cards = [
    {
      _id: '',
      name: 'Shae Blue',
      age: 22,
      gender: 'Female',
      location: 'Midrand',
      info: [
        {
          img: 'assets/profiles/1a.jpg',
          title: 'Profile',
          profile: {
            name: 'Shae Blue',
            age: 22,
            gender: 'Female',
            location: 'Midrand'
          }
        },
        {
          img: 'assets/profiles/1b.jpg',
          title: 'About',
          about: {
            ethnicity: 'black',// white, indian, colourd
            body: 'slim', //thick, slim-thick, bbw,
            skintone: 'melanin', //light-skin, white 
            orientation: 'straight' // bi, gay, lesbian, trans
          }
        },
        {
          img: 'assets/profiles/1c.jpg',
          title: 'Interests',
          interests: {
            into: 'tatoos', //piercings, long-hair, no-hair, beard, 
          }
        }
    
      ]
    },

    {
      _id: '',
      name: 'Bruce Wale',
      age: 37,
      gender: 'Male',
      location: 'Benoni',
      info: [
        {
          img: 'assets/profiles/2a.jpg',
          title: 'Profile',
          profile: {
            name: 'Bruce Wale',
            age: 37,
            gender: 'Male',
            location: 'Benoni',
          }
        },
        {
          img: 'assets/profiles/2b.jpg',
          title: 'About',
          about: {
            ethnicity: 'black',// white, indian, colourd
            body: 'slim', //thick, slim-thick, bbw,
            skintone: 'melanin', //light-skin, white 
            orientation: 'straight' // bi, gay, lesbian, trans
          }
        },
        {
          img: 'assets/profiles/2c.jpg',
          title: 'Interests',
          interests: {
            into: 'tatoos', //piercings, long-hair, no-hair, beard, 
          }
        }
    
      ]
    },

    {
      _id: '',
      name: 'Nancy Fine-One',
      age: 19,
      gender: 'Female',
      location: 'Durban',
      info: [
        {
          img: 'assets/profiles/3a.jpg',
          title: 'Profile',
          profile: {
            name: 'Nancy Fine-One',
            age: 19,
            gender: 'Female',
            location: 'Durban',
          }
        },
        {
          img: 'assets/profiles/3b.jpg',
          title: 'About',
          about: {
            ethnicity: 'black',// white, indian, colourd
            body: 'slim', //thick, slim-thick, bbw,
            skintone: 'melanin', //light-skin, white 
            orientation: 'straight' // bi, gay, lesbian, trans
          }
        },
        {
          img: 'assets/profiles/3c.jpg',
          title: 'Interests',
          interests: {
            into: 'tatoos', //piercings, long-hair, no-hair, beard, 
          }
        }
    
      ]
    },
  ]

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
  constructor(
    private gestureCtrl: GestureController, 
    private modalCtrl: ModalController,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private utilService: UtilService,
    private cdRef: ChangeDetectorRef) {}


  ngOnInit(): void {
    const token = this.authService.getToken();
    if(!token){
      this.authService.logout();
      this.router.navigateByUrl('login');
    }
    const u = this.authService.storageGet(STORAGE.ME);
    u.images = this.utilService.getBase64Images(u.images);
    u.profilePic = this.utilService.getBase64Image(u.profilePic);
    this.me = u;
    this.getUsers();
  }


  ngAfterViewInit() {
    this.loadingUsers = true;
    setTimeout(() => {
      this.initializeGestures();
      this.cdRef.detectChanges();
      this.loadingUsers = false;
    }, 1300);
  }

  getUsers() {
    this.userService.getUsers().subscribe((users: any) => {
      this.users = users.filter((u: User) => u._id !== this.me._id);
      if(this.users && this.users.length > 0) {
        this.users.forEach((u,i) => {
          this.users[i].images = this.utilService.getBase64Images(u.images);
        });
      }
      console.log("Base64 ", this.users);
      
    });
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
    const cards = document.querySelectorAll('.swipe-card');

    cards.forEach((card, index) => {
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
    const rotation = detail.deltaX > 0 ?  'rotate(30deg)' : 'rotate(-30deg)';

    const closeOp = Math.min(Math.max(offsetX / window.innerWidth, 0), 1);
    const heartOp = Math.min(Math.max(-offsetX / window.innerWidth, 0), 1);

    this.opacityClose = closeOp > 0 ? closeOp + 0.5: 0;
    this.opacityHeart =  heartOp > 0 ? heartOp + 0.5: 0;
 
    this.cdRef.detectChanges();

    const moveX = Math.min(Math.max(offsetX, -window.innerWidth / 2), window.innerWidth / 2);
    card.style.transform = `translateX(${moveX}px) ${rotation}`;
  }
 
  onCardEnd(detail: GestureDetail, index: number) {
    const card = document.querySelectorAll('.swipe-card')[index] as HTMLElement;
    const offsetX = detail.deltaX;
   
    this.opacityClose =  0;
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
    console.log('Card accepted:', this.cards[index]);
    this.removeCard(index);
  }

  onSwipeLeft(index: number) {
    console.log('Card rejected:', this.cards[index]);
    this.removeCard(index);
  }

  removeCard(index: number) {
    setTimeout(() => {
      this.cards.splice(index, 1);
      this.showNoMoreUsers = this.cards.length < 1;
      this.cdRef.detectChanges();
    }, 300); // Delay removal until the transition completes
  }

  handleNoMoreUsersChange(event: any){
    console.log("No more user ", event);
 
    setTimeout(() => {
      this.initializeGestures();
      this.loadingUsers = false;
      this.showNoMoreUsers = false;
      this.getUsers();
    }, 1300);
    this.cdRef.detectChanges();

  }
  
}