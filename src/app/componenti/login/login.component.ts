import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/modelli/interface';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error!: string;
  userDto: UserDto = new UserDto();
  constructor(public route: Router, private authservice: AuthServiceComp) {}
  onSubmit(form: NgForm) {
    this.authservice.login(this.userDto).subscribe((data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLog', 'true');
      this.route.navigate(['/homeUser']);
      console.log(data);
    });
  }
}
