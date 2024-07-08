import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserDto } from 'src/app/modelli/interface';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  persone!: User[];
  error: string = '';
  registerSuccess: string = '';
  isLoading: boolean = false;
  userDto: UserDto = new UserDto();
  constructor(public route: Router, private authService: AuthServiceComp) {}
  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.authService.register(this.userDto).subscribe({
      next: (data: any) => {
        this.registerSuccess = 'User has been successfully registered.';
        this.isLoading = false;
        this.route.navigate(['/login']);
      },
      error: (error) => {
        console.error('errore durante la richiesta: ', error.error);
        this.error = error.error;
        this.isLoading = false;
      },
    });
  }
}
