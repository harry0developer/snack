import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, GalleryPhotos } from '@capacitor/camera';

import { AuthService } from '../commons/services/auth.service';
import { APP_ROUTES, STORAGE } from '../commons/conts';
import { ImageBlob, User } from '../commons/model';
import { SettingsComponent } from '../pages/settings/settings.component';
import { UtilService } from '../commons/services/util.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { PhotoService } from '../commons/services/photo.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  profilePicture: string = 'assets/icons/user.png';

  img: string = '';

  blobImages: any[] = [];
  deviceId: string = '';

  galleryPhotos!: GalleryPhotos
  bioFormGroup!: FormGroup;
  bio: string = '';
  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private photoService: PhotoService
  ) { }

  ngOnInit() {

    this.bioFormGroup = this.formBuilder.group({
      bio: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  
    this.isLoading = false;
    this.currentUser = this.authService.storageGet(STORAGE.ME);
    console.log("CURRENT USER ", this.currentUser);
    this.bio = this.currentUser.bio;
    if (!this.currentUser || !this.currentUser.gender) {
      this.authService.logout();
      this.router.navigateByUrl(APP_ROUTES.RE_LOGIN)
    }
    console.log("User ", this.currentUser);
    
    this.getUserImages(this.currentUser.images);
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
  

  getUserImages(images: string[]) {
    this.images = [];
    if (this.currentUser.images && this.currentUser.images.length > 0) {
      console.log("images ", images);
      
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

  async uploadImages() {
    const result = await Camera.pickImages({
      quality: 50,
      limit: 5 - this.images.length 
    });

    if (!result.photos.length) {
      console.log('No images selected');
      return;
    }

    this.galleryPhotos = result;
    const loadingUploadImages = await this.loadingCtrl.create({ message: "Uploading images..." });
    await loadingUploadImages.present();


    this.photoService.uploadPhotos(this.galleryPhotos, this.currentUser._id).then( async (user: any) => {
      loadingUploadImages.dismiss();

      const loadingUser = await this.loadingCtrl.create({ message: "Uploading images..." });
      await loadingUser.present();
      this.authService.getUserById(this.currentUser._id).subscribe(u => {
        console.log("User", u);
        this.authService.storageSave(STORAGE.ME, u);
        this.currentUser = u;
        this.getUserImages(this.currentUser.images);
        this.cdr.detectChanges();
        loadingUser.dismiss();
      }, err => {
        console.log(err);
        loadingUser.dismiss();
      })
      
    }).catch(err => {
      console.log(err);
      loadingUploadImages.dismiss();
    })


  }


  async updateBio(){
    const loadingUpdateBio = await this.loadingCtrl.create({ message: "Uploading images..." });
    await loadingUpdateBio.present();
    const bio = this.bioFormGroup.get('bio')?.value;
    console.log(bio);
    this.currentUser.bio = bio;
    this.authService.updateUser(this.currentUser).subscribe((user: any) => {
      this.presentToast("Bio updated", 'bottom');
      loadingUpdateBio.dismiss();
      console.log(user);
      this.authService.saveLocalUser(user);
      this.currentUser = user;
       
    }, err => {
      loadingUpdateBio.dismiss();
      this.presentToast("An error occured while updating the profile picture", 'bottom');
      console.log("Images upload error ", err);
    })
  } 
  
  // Helper to extract file extension
  private getExtensionFromMime(mime: string): string {
    const map: any = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    return map[mime] || 'jpg';
  }
  
  //end multi

  private getProfilePic(filename: string) {
    console.log("getProfilePic", filename);
    if(filename) {
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
    
  }

  private async setProfilePicture(pic: any) {
    const loading = await this.loadingCtrl.create({ message: "Updating profile picture..." });
    await loading.present();    
    this.currentUser.profilePic = pic.filename;
    this.authService.storageSave(STORAGE.ME, this.currentUser);
    this.authService.updateUser(this.currentUser).subscribe(res => {
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
          this.uploadImages()
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadImages()
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