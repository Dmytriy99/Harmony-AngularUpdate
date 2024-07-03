import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { token } from '../service/api.export';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLog!: boolean;
  constructor(private router: Router) {}

  isAutenticated() {
    if (localStorage.getItem('isLog')) {
      return (this.isLog = true);
    } else {
      this.router.navigate(['/register']);
      return (this.isLog = false);
    }
  }
}
