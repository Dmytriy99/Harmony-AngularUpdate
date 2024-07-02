import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private route: Router, private authService: AuthServiceComp) {}
  logOut() {
    this.authService.logout().subscribe((data: any) => {
      console.log(data);
    });
    localStorage.removeItem('isLog');
    localStorage.removeItem('token');
    this.route.navigate(['register']);
  }
}
