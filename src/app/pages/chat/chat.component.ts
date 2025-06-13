import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../commons/services/chat.service';
import { Message, User } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { STORAGE } from 'src/app/commons/conts';
import { SocketService } from 'src/app/commons/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit {
  user!: User;
  me!: User;

  newMessage = '';
  messages: Message[] = [];


  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.me = this.authService.storageGet(STORAGE.ME);
    this.route.params.subscribe((params: any) => {
      console.log("Route user ", params);
      this.authService.getUserById(params.uid).subscribe((user: User) => {
        this.user = user;
        console.log("user ", this.user);

        this.joinChatRoom();
      }, err => {
        console.log(err);
      });

    })


  }


  joinChatRoom() {
    if(this.me._id &&  this.user._id)  {
      this.socketService.joinRoom(this.me._id, this.user._id);
      this.chatService.getChatHistory(this.me._id, this.user._id).subscribe((chats) => {
        this.messages = chats;
      }); 
    }

    this.socketService.receiveMessages().subscribe((message: any) => {
       this.ngZone.run(() => {
          this.messages.push(message); // UI will now update
          console.log("Recieved new message", this.messages);
        });
      // this.messages.push(message);
      this.cdr.detectChanges();
    });
  }

  sendMessage() {
    if (this.newMessage.trim() !== '' && this.me._id && this.user._id) {
      this.socketService.sendMessage(this.me._id, this.user._id, this.newMessage);
      this.newMessage = '';
    }
  }

  isMessageFromMe(msg: Message): boolean {
    return msg.sender == this.me._id;
  }

}
