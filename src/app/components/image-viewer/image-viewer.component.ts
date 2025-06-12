import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonButton, IonButtons, IonCard, IonDatetime, IonFooter,
  IonIcon, IonContent, IonCol, IonHeader, IonInput, IonItem,IonToolbar,
  IonLabel, IonSelect, IonSelectModal, IonSelectOption, IonRange, IonRow, IonGrid, IonImg
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
    imports: [
    IonHeader,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonButtons, 
    IonImg,
    IonToolbar
  ]
})
export class ImageViewerComponent {
  @Input() imageUrl: string = '';
  scale = 1;
  lastScale = 1;
  position = { x: 0, y: 0 };
  lastPosition = { x: 0, y: 0 };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onPinch(event: any) {
    this.scale = this.lastScale * event.scale;
  }

  onPinchEnd() {
    this.lastScale = this.scale;
  }

  onPan(event: any) {
    this.position.x = this.lastPosition.x + event.deltaX;
    this.position.y = this.lastPosition.y + event.deltaY;
  }

  onPanEnd() {
    this.lastPosition = { ...this.position };
  }
}
