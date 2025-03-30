import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
 import { ActionSheetController } from '@ionic/angular';
import { Camera,  CameraResultType, CameraSource } from '@capacitor/camera';
 
 import { GalleryModule, GalleryItem, ImageItem, GalleryComponent, Gallery } from 'ng-gallery';

import { Lightbox } from 'ng-gallery/lightbox';

import moment from 'moment';
import { AuthService } from '../commons/services/auth.service';
import { STORAGE } from '../commons/conts';
import { User } from '../commons/model';
import { SettingsComponent } from '../pages/settings/settings.component';
import { UtilService } from '../commons/services/util.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit{
  user: any;
  firebaseUser: any;
  images: [] = [];
  profilePicture: string = '';
  currentUser: any;
  isLoading: boolean = true; 
  galleryId = 'myLightbox';

  galImages: GalleryItem[] = [];
  
  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private utilService: UtilService,
    public gallery: Gallery, private lightbox: Lightbox,
    private cdr: ChangeDetectorRef,
    private toastController: ToastController
    ) {} 
// "+22908900002000"
  async ngOnInit() {
    this.isLoading = false;
    this.currentUser = this.authService.storageGet(STORAGE.ME); 
    this.profilePicture =  'data:image/jpeg;base64, ' + this.currentUser.profilePic;
    console.log("Current User", this.currentUser);
    this.images = this.currentUser.images.map((i: any) =>  'data:image/jpeg;base64, ' + i)
  }

  initialiseGallery(user: User) {
    this.galImages = [];

    user.images?.forEach((img:string) => {
      this.galImages.push( 
        new ImageItem({ src: img, thumb: '' } ),
      );
    })
 
    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.setConfig( {
      nav: false
    })
    galleryRef.load(this.galImages);

  }

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  private viewPhoto(index: number) {
    // this.showImage(index);
  }

  getAge(dob: string) {
  }

  async showAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: false
    });
    await alert.present();
    // alert.onDidDismiss().then(() => {
    //   this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true})
    // });
  }

  async openSettingsModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsComponent,
      componentProps: {
        "user": this.currentUser
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  getUserAge(): number {
    console.log("Age ", this.currentUser);
    
    if(this.currentUser && !!this.currentUser.dob) {
      return this.utilService.getAge(this.currentUser.dob);
    }
    return 99;
  }
 
  onWillDismiss(e: any) {
    console.log(e);
  } 

  showGallery(index: number) {
    let imgs: any[] = [];
    for(let img of this.currentUser.images ) {
      imgs.push({path: img})
    }
    let prop = {
        images: imgs,
        index,
        counter: true,
        arrows: false
    };
    // this.gallery.load(prop);
  }


  async uploadImage(source: CameraSource) {
    const loading = await this.loadingCtrl.create({message: "Updating profile picture..."});
    await loading.present();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image && image.base64String) { 
      this.authService.uploadImage(image.base64String, this.currentUser._id).subscribe(res => {
        this.updateCurrentUser(res[0]);
        this.presentToast("Image uploaded successfully", 'bottom');
        loading.dismiss();
      }, err => {
        loading.dismiss();
        this.presentToast("An error occured while uploading the image", 'bottom');
        console.log("Images upload error ", err);
      })
    }
  }


  private async setProfilePicture(index: number) {
    const loading = await this.loadingCtrl.create({message: "Updating profile picture..."});
    await loading.present();

    this.authService.updateProfilePic(this.currentUser.images[index], this.currentUser._id).subscribe(res => {
      this.updateCurrentUser(res);
      this.presentToast("Image uploaded successfully", 'bottom');
      loading.dismiss();
    }, err => {
      loading.dismiss();
      this.presentToast("An error occured while uploading the image", 'bottom');
      console.log("Images upload error ", err);
    })
    
  }

  private async deletePhoto(index: number) {
    const loading = await this.loadingCtrl.create({message: "Deleting photo..."});
    await loading.present();

    const imgs = this.currentUser.images.splice(index, 1);
    
    this.authService.updateImages(this.currentUser.images, this.currentUser._id).subscribe(res => {
      this.updateCurrentUser(res);
      loading.dismiss();
    }, err => {
      loading.dismiss();
      console.log(err.error.message);
    })
   }

   private updateCurrentUser(user: any) {
      this.currentUser = user;
      this.authService.storageSave(STORAGE.ME, user);
      this.images = user.images.map((i: any) =>  'data:image/jpeg;base64, ' + i);
      this.cdr.detectChanges();
   }

  async openImageActionSheet(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photo settings",
      buttons: [
        {
          text: 'View Photo',
          handler: () => {
            this.viewPhoto(index)
          }
        },
        {
          text: 'Set As Profile Picture',
          handler: () => {
            this.setProfilePicture(index)
          }
        },
        {
          text: 'Delete Photo',
          handler: () => {
            this.deletePhoto(index)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  
 
  async selectImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.uploadImage(CameraSource.Photos)
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadImage(CameraSource.Camera)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}