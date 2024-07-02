import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error!: string;
  localToken: string = localStorage.getItem('token')!;
  localEmail: string = localStorage.getItem('email')!;
  constructor(public route: Router, private authservice: AuthServiceComp) {}
  onSubmit(form: NgForm) {
    const loginData = {
      name: form.value.name,
      password: form.value.password,
    };
    this.authservice.login(loginData).subscribe((data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLog', 'true');
      this.route.navigate(['/users']);
      console.log(data);
    });
  }
}
