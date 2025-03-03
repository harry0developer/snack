import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/commons/services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: false

})
export class OtpComponent  implements OnInit {
otp: any;
  error: string = '';

  phoneNumber: string = '';


  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
  }
 

  goToSignIn(){
    this.router.navigateByUrl('login')
  }


  digitValidate(ele: any){
    console.log(ele.value);
    ele.value = ele?.value?.replace(/[^0-9]/g,'');
    console.log("Ele value ",ele.val);
    
  }
  
  tabChange(val: any){
      let ele = document.querySelectorAll('input');
      if(ele[val] && ele[val-1].value != ''){
        ele[val].focus()
      }else if(ele[val-1].value == ''){
        ele[val-2].focus()
      }   
      this.otp = ele;
   }
  
  
   verifyOtp() {
    let Otpval = '';
    this.otp.forEach((e: any)=> {
      Otpval += e.value + ''
    });
    
    const phoneNumber = this.authService.storageGet("phone");
    this.authService.verifyOtp(phoneNumber, Otpval)
   }

}
