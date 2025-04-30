import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonRange } from '@ionic/angular/standalone';
import { NotFound, Range, User } from 'src/app/commons/model';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [IonRange, IonButton, IonIcon],
  standalone: true
})
export class NotFoundComponent {

  @Input() data!: NotFound;
  
}
