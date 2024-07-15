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
  isLoading = false;
  disabledLog = false;
  constructor(public route: Router, private authservice: AuthServiceComp) {}
  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.authservice.login(this.userDto).subscribe({
      next: (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLog', 'true');
        this.route.navigate(['/homeUser']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('errore durante la richiesta: ', error.error.message);
        this.error = error.error.message;
        this.isLoading = false;
      },
    });
  }
}
