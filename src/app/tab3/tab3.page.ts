import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { GalleryModule, GalleryItem, ImageItem, GalleryComponent, Gallery } from 'ng-gallery';

import { Lightbox } from 'ng-gallery/lightbox';

import moment from 'moment';
import { AuthService } from '../commons/services/auth.service';
import { APP_ROUTES, STORAGE } from '../commons/conts';
import { ImageBlob, User } from '../commons/model';
import { SettingsComponent } from '../pages/settings/settings.component';
import { UtilService } from '../commons/services/util.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  user: any;
  firebaseUser: any;
  images: any[] = [];
  currentUser: any;
  isLoading: boolean = true;
  galleryId = 'myLightbox';

  galImages: GalleryItem[] = [];
  profilePicture: string = 'assets/user.png';

  img: string = '';
  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private utilService: UtilService,
    public gallery: Gallery, private lightbox: Lightbox,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.currentUser = this.authService.storageGet(STORAGE.ME);
    if (!this.currentUser || !this.currentUser.gender) {
      this.authService.logout();
      this.router.navigateByUrl(APP_ROUTES.RE_LOGIN)
    }
    console.log("User ", this.currentUser);
    
    this.getUserImages(this.currentUser.images);
  }

  initialiseGallery(user: User) {
    this.galImages = [];

    user.images?.forEach((img: string) => {
      this.galImages.push(
        new ImageItem({ src: img, thumb: '' }),
      );
    })

    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.setConfig({
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

    if (this.currentUser && !!this.currentUser.dob) {
      return this.utilService.getAge(this.currentUser.dob);
    }
    return 99;
  }

  onWillDismiss(e: any) {
    console.log(e);
  }

  showGallery(index: number) {
    let imgs: any[] = [];
    for (let img of this.currentUser.images) {
      imgs.push({ path: img })
    }
    let prop = {
      images: imgs,
      index,
      counter: true,
      arrows: false
    };
    // this.gallery.load(prop);
  }


  async uploadImage(uploadImage: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    const blob = this.dataURLtoBlob(image.dataUrl!);

    const formData = new FormData();
    const mime = image.format || 'jpeg';
    const extension = mime === 'png' ? 'png' : 'jpg';
    const fileName = `photo_${Date.now()}.${extension}`;

    formData.append('uid', this.currentUser._id);
    formData.append('file', blob, fileName);

    this.authService.uploadImage(formData).subscribe({
      next: (res: any) => {
        console.log("res.user", res.user);
        
        this.authService.storageSave(STORAGE.ME, res.user);
        this.currentUser = res.user;
        this.getUserImages(res.user.images);
      },
      error: err => console.error('Upload failed:', err),
    });
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  getUserImages(images: string[]) {
    this.images = [];
    if (this.currentUser.images && this.currentUser.images.length > 0) {
      images.forEach((filename: any) => {
        this.authService.getImageData(this.currentUser._id, filename).subscribe((blob: any) => {
          const objectURL = URL.createObjectURL(blob);
          const bob: ImageBlob = {
            img: this.sanitizer.bypassSecurityTrustUrl(objectURL),
            filename
          }
          this.images.push(bob);
        }, err => console.log(err))
      });      
      this.getProfilePic(this.currentUser.profilePic);
      this.cdr.detectChanges();

    }
  }


  private getProfilePic(filename: string) {
    console.log("getProfilePic", filename);
    
    this.authService.getImageData(this.currentUser._id, filename).subscribe((blob: any) => {
      const objectURL = URL.createObjectURL(blob);
      const bob: ImageBlob = {
        img: this.sanitizer.bypassSecurityTrustUrl(objectURL),
        filename
      }
      this.profilePicture = bob.img.changingThisBreaksApplicationSecurity;
      console.log("Profile pic", bob);
      
      this.cdr.detectChanges();
    }, err => console.log(err))
  }

  private async setProfilePicture(pic: any) {
    const loading = await this.loadingCtrl.create({ message: "Updating profile picture..." });
    await loading.present();    
    this.currentUser.profilePic = pic.filename;
    this.authService.storageSave(STORAGE.ME, this.currentUser);
    this.authService.updateProfilePic(this.currentUser).subscribe(res => {
      this.presentToast("Profile picture updated", 'bottom');
      this.profilePicture = pic.img.changingThisBreaksApplicationSecurity;

      loading.dismiss();
    }, err => {
      loading.dismiss();
      this.presentToast("An error occured while updating the profile picture", 'bottom');
      console.log("Images upload error ", err);
    })

  }

  private async deletePhoto(img: any) {
    const loading = await this.loadingCtrl.create({ message: "Deleting photo..." });
    await loading.present();

    this.authService.deleteImage(this.currentUser._id, img.filename).subscribe((res: any) => {
      if (res && res._id) {
        this.currentUser = res;
        this.authService.storageSave(STORAGE.ME, res)
      }
      const index = this.images.indexOf(img);
      this.images.splice(index, 1);
      this.cdr.detectChanges();
      loading.dismiss();
    }, err => {
      loading.dismiss();
      console.log(err.error.message);
    })
  }


  async openImageActionSheet(img: any) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photo settings",
      buttons: [
        {
          text: 'View Photo',
          handler: () => {
            this.viewPhoto(img)
          }
        },
        {
          text: 'Set As Profile Picture',
          handler: () => {
            this.setProfilePicture(img)
          }
        },
        {
          text: 'Delete Photo',
          handler: () => {
            this.deletePhoto(img)
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