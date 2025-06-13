import { Component } from '@angular/core';
import { ChatService } from '../commons/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../commons/services/auth.service';
import { STORAGE } from '../commons/conts';
import { ImageBlob, NotFound, User } from '../commons/model';
import { SocketService } from '../commons/services/socket.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

export interface Chat {
  sender: string;
  receiver: string;
  message: string
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  chats: any[] = [];
  newMessage = '';

  img = "https://placehold.co/100";

  user1 = '67bf5a9309198059231e6658'; // Example user1
  user2 = '67c1d197791f5135732d2c1f'; // Example user2

  sender = {
    "_id": "67c1d197791f5135732d2c1f",
    "name": "Thomas Malusi",
    "age": 49,
    "gender": "Male",
    "location": "Mamelodi",
    "info": [
      {
        "img": "assets/profiles/1a.jpg",
        "title": "Profile",
        "profile": {
          "name": "Thomas Malusi",
          "age": 49,
          "gender": "Male",
          "location": "Mamelodi"
        }
      },
      {
        "img": "assets/profiles/1b.jpg",
        "title": "About",
        "about": {
          "race": "black",
          "body": "build",
          "skintone": "melanin",
          "orientation": "straight"
        }
      },
      {
        "img": "assets/profiles/1c.jpg",
        "title": "Interests",
        "interests": {
          "into": "tattoos"
        }
      }
    ],
    "__v": 0
  };

  receiver = {
    "_id": "67bf5a9309198059231e6658",
    "name": "Shae Blue",
    "age": 22,
    "gender": "Female",
    "location": "Midrand",
    "info": [
      {
        "img": "assets/profiles/1a.jpg",
        "title": "Profile",
        "profile": {
          "name": "Shae Blue",
          "age": 22,
          "gender": "Female",
          "location": "Midrand",
          "_id": "67bf5a9309198059231e665a"
        },
        "_id": "67bf5a9309198059231e6659"
      },
      {
        "img": "assets/profiles/1b.jpg",
        "title": "About",
        "about": {
          "race": "black",
          "body": "slim",
          "skintone": "melanin",
          "orientation": "straight",
          "_id": "67bf5a9309198059231e665c"
        },
        "_id": "67bf5a9309198059231e665b"
      },
      {
        "img": "assets/profiles/1c.jpg",
        "title": "Interests",
        "interests": {
          "into": "tattoos",
          "_id": "67bf5a9309198059231e665e"
        },
        "_id": "67bf5a9309198059231e665d"
      }
    ],
    "__v": 0
  }

  notFound: NotFound = {
    icon: 'assets/icons/chats.svg',
    title: 'Keep swipping',
    body: 'Your matches will appear here where you can send them a message'
  }

  users: any[] = [];
  currentUser!: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    const token = this.authService.getToken();

    if (!token) {
      this.authService.logout();
      this.router.navigateByUrl('login');
    }
    this.currentUser = this.authService.storageGet(STORAGE.ME);
    const loading = await this.loadingCtrl.create({ message: "Loading matches..." });
    await loading.present();

    this.authService.getUserById(this.currentUser._id!).subscribe((user: any) => {
      console.log(user);
      this.authService.getUsersById(user.matches).subscribe((users: any) => {
        console.log(users);
        this.users = users;
        this.users.forEach((u: any) => {
          this.authService.getImageData(u._id, u.profilePic).subscribe((blob: any) => {
            const objectURL = URL.createObjectURL(blob);
            u.profilePic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            loading.dismiss();
          }, err => {
            user.profilePic = 'assets/icons/profile-picture.png'
            console.log(err);
            loading.dismiss();
          });

          // GET LAST MESSAGE 
           this.chatService.getLastMessage(this.currentUser?._id!, u._id).subscribe((last: any) => {
            console.log(last);
            u.lastMessage = last;
          }, err => {
            console.log(err);
          })
          
        });

      }, err => {
        console.log(err);
        loading.dismiss();
      })
    }, err => {
      console.log(err);
      loading.dismiss();
    });


    this.getMyChats();
  }


  async getMyChats() {
    console.log("Get chats ");
    
    const loading = await this.loadingCtrl.create({ message: "Loading chats..." });
    await loading.present();

    this.chatService.getMyChats(this.currentUser?._id!).subscribe((chats: any) => {
      console.log(chats);
      this.chats = chats;
      loading.dismiss()
    }, err => {
      console.log(err);
      loading.dismiss();
    })
  }

  openChats(user: any) {
    console.log(user);
    // this.authService.storageSave(STORAGE.USER, user); //TODO: Save chats
    this.router.navigate(['chat', user._id]);

    // this.router.navigate(['chat', user.uid, { user: JSON.stringify(user) }])

    console.log(user);
    

  }

  getSender(msg: Chat) {
    return this.sender._id === msg.sender ? this.sender.name : this.receiver.name;
  }

  getLastMessage(user: any) {
    this.chatService.getLastMessage(this.currentUser?._id!, user._id).subscribe((last: any) => {
      console.log(last);
      
    }, err => {
      console.log(err);
      
    })
  }

}
