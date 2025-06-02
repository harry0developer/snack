import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-allow-tracking',
  templateUrl: './allow-tracking.component.html',
  styleUrls: ['./allow-tracking.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class AllowTrackingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  allow() {}

}
