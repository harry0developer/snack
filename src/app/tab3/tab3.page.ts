import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
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
    public gallery: Gallery, private lightbox: Lightbox
    ) {} 

  async ngOnInit() {
    this.isLoading = false;
    this.currentUser = this.authService.storageGet(STORAGE.ME); 
    this.user = this.currentUser;
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

  
  showImage(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen'
    });
  }

  private viewPhoto(index: number) {
    this.showImage(index);
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
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  getUserAge(): number {
    console.log("Age ", this.user);
    
    if(this.user && !!this.user.dob) {
      return this.utilService.getAge(this.user.dob);
    }
    return 99;
  }
 
  onWillDismiss(e: any) {
    console.log(e);
  } 

  showGallery(index: number) {
    let imgs: any[] = [];
    for(let img of this.user.images ) {
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
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {

      console.log("IMAGE UPLOAD ", image);
      

      this.authService.uploadImage(source, this.currentUser._uid).subscribe(res => {
        console.log("Images uploaded ", res);
        
      }, err => {
        console.log("Images upload error ", err);

      })

      // const loading = await this.loadingCtrl.create({message: "Uploading image, please wait..."});
      // await loading.present();

      // // const img = await this.firebaseService.savePictureInFirebaseStorage(image);
      
      // if(this.user.images.length < 1 && !this.user.profile_picture) {
      //   this.user.profile_picture = img;
      // }
      // this.user.images.push(img);
      // await this.firebaseService.addDocumentToFirebaseWithCustomID(COLLECTION.USERS,this.user).then(() => {
      //   loading.dismiss();
      // }).catch(err => {
      //   loading.dismiss();
      // })

    }
  }

  
  private async setProfilePicture(index: number) {
    const loading = await this.loadingCtrl.create({message: "Updating profile picture, please wait..."});
    await loading.present();
    this.user.profile_picture = this.user.images[index];
    // this.firebaseService.updateUserProfilePicture(this.user).then(() => {
    //   loading.dismiss();
    // }).catch(err => {
    //   console.log(err);
    //   loading.dismiss()
    // })
    
  }

  private async deletePhoto(index: number) {
    const delLoading = await this.loadingCtrl.create({message: "Deleting photo, please wait..."});
    await delLoading.present();
    const updateLoading = await this.loadingCtrl.create({message: "Updating your profile, please wait..."});
    // this.firebaseService.deletePhotoFromFirebaseStorage(this.user, this.user.images[index])
    // .then((res) => {
    //   delLoading.dismiss();
    //   console.log("Photo deleted successfully", res);
    //    updateLoading.present();

    //   this.firebaseService.updateUserPhotoList(this.user, this.user.images[index]).then(img => {
    //     console.log("User profile updated");
    //     updateLoading.dismiss();
        
    //   }).catch(err => {
    //     console.log("User Profile not updated", err);
    //     updateLoading.dismiss();
        
    //   })
      
    // }).catch((error) => {
    //   console.log(error);
    //   delLoading.dismiss();

    // });

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