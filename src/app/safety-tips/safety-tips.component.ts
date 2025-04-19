import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-safety-tips',
  templateUrl: './safety-tips.component.html',
  styleUrls: ['./safety-tips.component.scss'],
  imports: [IonicModule]
})
export class SafetyTipsComponent {

  constructor(private modalCtrl: ModalController) { }


  close() {
    this.modalCtrl.dismiss();
  }

}
