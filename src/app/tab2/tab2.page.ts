import { Component } from '@angular/core';
import { ChatService } from '../commons/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../commons/services/auth.service';
import { STORAGE } from '../commons/conts';
import { User } from '../commons/model';
import { SocketService } from '../commons/services/socket.service';
 
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
  messages: any[] = [];
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


  users: any[] = [];
  constructor(
    private route: ActivatedRoute , 
    private router: Router,
    private chatService: ChatService,
     private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit() { 
    const me = this.authService.storageGet(STORAGE.ME);
    const token = this.authService.getToken();
    if(!token){
      this.authService.logout();
      this.router.navigateByUrl('login');
    }

    console.log("has token", token);
    
    
    this.authService.getUsers().subscribe((users: any) => {
      
      this.users = users.filter((u: User) => u._id !== me._id);
    })
  }

  openChats(user: any) {
    console.log(user);
    // this.authService.storageSave(STORAGE.USER, user); //TODO: Save chats
    this.router.navigate(['chat', user._id]);
  }

  getSender(msg: Chat) {
    return this.sender._id === msg.sender ? this.sender.name : this.receiver.name;
  }


}
