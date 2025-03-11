import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/commons/services/auth.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: false
})
export class SetupComponent  implements OnInit {
  profileFormGroup!: FormGroup;

  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
 step: number = 1;
  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder,
    private router: Router) {}


  ngOnInit() {
    this.profileFormGroup = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(9),
      ])),
      dob: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ]))

    });
  }

  next() {
    this.step++;
  }

  back() {
    this.step = this.step > 1 ? --this.step : this.step;
  }
  goToSignIn(){
    this.router.navigateByUrl('login')
  }

}
