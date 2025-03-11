import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../commons/services/chat.service';
import { Message, User } from 'src/app/commons/model';
import { AuthService } from 'src/app/commons/services/auth.service';
import { STORAGE } from 'src/app/commons/conts';
import { UserService } from 'src/app/commons/services/user.service';
import { SocketService } from 'src/app/commons/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent  implements OnInit{
  user!: User;
  me!: User;
  
  newMessage = '';
  messages: Message[] = [];


  constructor( 
    private route: ActivatedRoute , 
    private chatService: ChatService,
    private userService: UserService,
    private socketService: SocketService,
    private authService: AuthService

  ) { }
  
  ngOnInit() {
    this.me = this.authService.storageGet(STORAGE.ME);
    this.user = this.authService.storageGet(STORAGE.USER);
    if(this.me._id &&  this.user._id)  {
      this.socketService.joinRoom(this.me._id, this.user._id);

      this.chatService.getChatHistory(this.me._id, this.user._id).subscribe((chats) => {
        this.messages = chats;
        console.log('Retutned chats ', chats);
      }); 
    }
 
    console.log("ME ", this.me);
    console.log("Other ", this.user);

    this.socketService.receiveMessages().subscribe((message: any) => {
      this.messages.push(message);
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
