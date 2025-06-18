import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() { }


  async showSplashscreen() {
    await SplashScreen.hide();

    await SplashScreen.show({
      autoHide: false,
    });

    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
