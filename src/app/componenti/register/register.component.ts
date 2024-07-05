import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserDto } from 'src/app/modelli/interface';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';

import { userService } from 'src/app/service/userService/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  urlUser: string = 'https://gorest.co.in/public/v2/users';
  persone!: User[];
  error: string = '';
  userDto: UserDto = new UserDto();
  constructor(public route: Router, private authService: AuthServiceComp) {}
  onSubmit(form: NgForm) {
    this.authService.register(this.userDto).subscribe({
      next: (data: any) => {
        console.log(data);
        this.route.navigate(['/login']);
      },
      error: (error) => {
        console.error('errore durante la richiesta: ', error.error);
        this.error = error.error;
      },
    });
  }
}
