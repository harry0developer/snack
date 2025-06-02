import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-allow-notifications',
  templateUrl: './allow-notifications.component.html',
  styleUrls: ['./allow-notifications.component.scss'],
   imports: [
      IonicModule,
      CommonModule
    ]
})
export class AllowNotificationsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  allow() {}

}
