import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-allow-location',
  templateUrl: './allow-location.component.html',
  styleUrls: ['./allow-location.component.scss'],
   imports: [
      IonicModule,
      CommonModule
    ]
})
export class AllowLocationComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  allow() {}
}
