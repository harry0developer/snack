import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { GestureController, Gesture, GestureDetail, ModalController } from '@ionic/angular';
import { Preferences, PreferencesComponent } from '../preferences/preferences.component';
import { AuthService } from '../commons/services/auth.service';
import { STORAGE } from '../commons/conts';
import { Router } from '@angular/router';
import moment from 'moment';
import { User } from '../commons/model';
 
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


  swipeCards: User[] = [
    {
      _id: '',
      name: 'Jon Doe',
      dob: '12/12/1991',
      gender: 'Male',
      age: 34,
      location: { name: 'Midrand', lat: -25.5999, lng: 28.0007 },
      images: ['assets/profiles/1a.jpg', 'assets/profiles/1b.jpg', 'assets/profiles/1c.jpg'],
      phoneNumber: '+27829390061',
      username: '+27829390061',
      password: 'qwerty',
      ethnicity: 'Black',
      bodyType: 'Slim',
      sexualOrientation: 'Straight',
      interests: ['Sky diving'],
      preferences: {
        ethnicity: ['Black', 'Asian'],
        age: { lower: 18, upper: 27 },
        want: ['One night stand', 'No string attached'],
        with: ['Female'],
        distance: 100
      }
    },

    {
      _id: '',
      name: 'Keem Lue ',
      dob: '04/04/1998',
      gender: 'Female',
      age: 34,
      location: { name: 'South Gate', lat: -26.5999, lng: 28.0007 },
      images: ['assets/profiles/2a.jpg', 'assets/profiles/2b.jpg', 'assets/profiles/2c.jpg'],
      phoneNumber: '+278100099991',
      username: '+278100099991',
      password: 'qwerty',
   
      ethnicity: 'Asian',
      bodyType: 'Slim',
      sexualOrientation: 'Straight',
      interests: ['Sky diving'],
     
      preferences: {
        ethnicity: ['Black', 'Asian'],
        age: { lower: 18, upper: 55 },
        want: ['No string attached'],
        with: ['Male'],
        distance: 55
      }
    },
    
    {
      _id: '',
      name: 'Steve Madden',
      dob: '19/12/2000',
      gender: 'Male',
      age: 34,
      location: { name: 'Benoni', lat: -25.4444, lng: 27.9999 },
      images: ['assets/profiles/3a.jpg', 'assets/profiles/3b.jpg', 'assets/profiles/3c.jpg'],
      phoneNumber: '+277400018800',
      username: '+277400018800',
      password: 'qwerty',
        ethnicity: 'White',
        bodyType: 'Slim',
        sexualOrientation: 'Straight',
        interests: ['Sky diving'],
      preferences: {
        ethnicity: ['Black', 'Asian'],
        age: { lower: 18, upper: 27 },
        want: ['One night stand', 'No string attached'],
        with: ['Female'],
        distance: 67
      }
    },
    {
      _id: '',
      name: 'Page Book',
      dob: '19/12/1999',
      gender: 'Female',
      age: 34,
      images: ['assets/profiles/3a.jpg', 'assets/profiles/3b.jpg', 'assets/profiles/3c.jpg'],
      phoneNumber: '+277400018800',
      username: '+277400018800',
      password: 'qwerty',
        ethnicity: 'White',
        bodyType: 'Slim',
        sexualOrientation: 'Straight',
        interests: ['Sky diving'],
      preferences: {
        ethnicity: ['Black', 'Asian'],
        age: { lower: 18, upper: 27 },
        want: ['One night stand', 'No string attached'],
        with: ['Female'],
        distance: 67
      }
    }
  ];


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
    private cdRef: ChangeDetectorRef) {}


  ngOnInit(): void {
    const token = this.authService.getToken();
    if(!token){
      this.authService.logout();
      this.router.navigateByUrl('login');
    }
  }


  ngAfterViewInit() {
    this.loadingUsers = true;
    setTimeout(() => {
      this.initializeGestures();
      this.cdRef.detectChanges();
      this.loadingUsers = false;
    }, 1300);
  }

  getAge(dob: string) {
    return moment().diff(dob, 'years',false);
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
      this.cdRef.detectChanges();
      this.loadingUsers = false;

    }, 1300);

  }
  
}