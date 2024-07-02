import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { userService } from 'src/app/service/userService/user.service';
import { User } from 'src/app/modelli/interface';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

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
  email!: string;
  name!: string;
  page = 1;
  limit = 10;
  totalUser = 0;
  currentPage = 0;
  remainingUsers = 0;
  constructor(private userService: userService) {}
  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getUser(this.page, this.limit).subscribe((data: any) => {
      this.users = data.user;
      this.loadAllImage();
      this.totalUser = data.totalUser;
      this.calculateRemainingUsers();
      console.log(data);
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
  onSubmit(form: NgForm) {
    if (!form.value.title) {
      this.getAllUser();
    } else if (this.selectedOption === '1') {
      this.onSearch(form);
    } else if (this.selectedOption === '2') {
      this.onSearchEmail(form);
    }
  }
  onSearch(form: NgForm) {
    const title = form.value.title;
    this.userService.getUserBySearch(title).subscribe((data: any) => {
      this.users = data.user;
      this.loadAllImage();
      this.totalUser = this.users.length;
      this.calculateRemainingUsers();
    });
  }
  onSearchEmail(form: NgForm) {
    const email = form.value.title;
    this.userService.getUserBySearchEmail(email).subscribe((data: any) => {
      this.users = data.user;
    });
  }
  back() {
    window.location.reload();
  }
}
