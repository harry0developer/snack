import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonRange } from '@ionic/angular/standalone';
import { Range } from 'src/app/commons/model';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-no-users',
  templateUrl: './no-users.component.html',
  styleUrls: ['./no-users.component.scss'],
  imports: [IonRange, IonButton, IonIcon],
  standalone: true
})
export class NoUsersComponent  implements OnInit {
  range: Range = {min: 0, max: 100, value: 30, pin: true};
  @Output() onChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}
  
  onIonChange(event: any){
    console.log("Range ", event.detail.value);
    this.range.value = event.detail.value;
    this.onChange.emit(event.detail.value);
  }
}
