import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userService } from 'src/app/service/userService/user.service';
import { User, UserDto } from 'src/app/modelli/interface';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { token } from 'src/app/service/api.export';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'purple' },
    },
  ],
})
export class UsersComponent implements OnInit {
  selectedOption!: string;
  userImage: { [key: string]: string } = {};
  userID: any;
  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';

  defaultImage: any;

  users: User[] = [];
  page = 1;
  limit = 10;
  totalUser = 0;
  currentPage = 0;
  remainingUsers = 0;
  userDto: UserDto = new UserDto();
  isLoading = false;
  constructor(private userService: userService, private router: Router) {}
  ngOnInit(): void {
    if (token) {
      this.getAllUser();
    }
  }

  getAllUser() {
    this.isLoading = true;
    this.userService
      .getUser(this.page, this.limit)
      .pipe(catchError((error: any) => this.handleError(error)))
      .subscribe((data: any) => {
        this.users = data.user;
        this.loadAllImage();
        this.totalUser = data.totalUser;
        this.calculateRemainingUsers();
        this.isLoading = false;
      });
  }

  getUserImage(userId: string) {
    this.userService.getUserImage(userId).subscribe({
      next: (response: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          this.userImage[userId] = reader.result as string;
        };
      },
      error: (error) => {
        console.error('errore', error);
      },
    });
  }

  loadAllImage() {
    this.users.forEach((user) => {
      if (user.image) {
        this.getUserImage(user._id);
      } else {
        this.userImage[user._id] =
          user.gender === 'female' ? this.photoGirl2 : this.photoMan2;
      }
    });
  }
  // Limite massimo di user visualizzati inizialemte è di 10 e col bottone ne carica di 10 in 10
  loadMoreUsers(): void {
    this.page++;
    this.userService.getUser(this.page, this.limit).subscribe((data: any) => {
      this.users = [...this.users, ...data.user];
      this.loadAllImage();
      this.totalUser = data.totalUser;
      this.calculateRemainingUsers();
    });
  }

  calculateRemainingUsers(): void {
    this.remainingUsers = this.totalUser - this.users.length;
  }

  // cercare gli user tramite o nome o email
  onSubmit(form: NgForm) {
    if (!form.value.search) {
      this.page = 1;
      this.getAllUser();
    } else if (this.selectedOption === '1') {
      this.onSearch(form);
    } else if (this.selectedOption === '2') {
      this.onSearchEmail(form);
    }
  }

  // cerca user tramite nome e calcola le pagine degli user trovati
  onSearch(form: NgForm) {
    this.userService
      .getUserBySearch(this.userDto.search)
      .subscribe((data: any) => {
        this.users = data.user;
        this.loadAllImage();
        this.totalUser = this.users.length;
        this.calculateRemainingUsers();
      });
  }

  // cerca user tramite email e calcola le pagine degli user trovati
  onSearchEmail(form: NgForm) {
    this.userService
      .getUserBySearchEmail(this.userDto.search)
      .subscribe((data: any) => {
        this.users = data.user;
        this.loadAllImage();
        this.totalUser = this.users.length;
        this.calculateRemainingUsers();
      });
  }
  back() {
    window.location.reload();
  }

  // se il token è scaduto torna al log-in
  handleError(error: any) {
    if (
      error.status === 500 &&
      error.error.message === 'Failed to authenticate token.'
    ) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    return throwError(() => new Error('Token expired'));
  }
}
