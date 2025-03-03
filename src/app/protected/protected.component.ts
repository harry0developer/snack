import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../commons/services/auth.service';

@Component({
  selector: 'app-protected',
  templateUrl: 'protected.component.html',
  styleUrls: ['protected.component.scss'],
})
export class ProtectedComponent implements OnInit {
  message: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Get protected data
    this.http
      .get('http://localhost:5001/api/protected', {
        headers: { Authorization: token },
      })
      .subscribe(
        (response: any) => {
          this.message = response.message;
          console.log("Protected ", response);
          this.router.navigateByUrl('/tabs/tab1')
        },
        (error) => {
          console.error('Error accessing protected route', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
