import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonRange } from '@ionic/angular/standalone';
import { Range, User } from 'src/app/commons/model';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-no-users',
  templateUrl: './no-users.component.html',
  styleUrls: ['./no-users.component.scss'],
  imports: [IonRange, IonButton, IonIcon],
  standalone: true
})
export class NoUsersComponent implements AfterViewInit {

  range: Range = {min: 0, max: 100, value: 30, pin: true};
  @Output() onChange = new EventEmitter<number>();
  @Input() user!: any;

  onIonChange(event: any){
    this.range.value = event.detail.value;
    this.onChange.emit(event.detail.value);
  }

  handelDistanceRangeChange() {
    this.onChange.emit(this.range.value);
  }

  ngAfterViewInit(): void {
    console.log(this.user);

     
  }
}
