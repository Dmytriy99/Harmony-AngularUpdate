import { Component, OnInit } from '@angular/core';

import { Post, User } from 'src/app/modelli/interface';
import { MatDialog } from '@angular/material/dialog';
import { postService } from 'src/app/service/postService/post.service';

import { userService } from 'src/app/service/userService/user.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-personal-user',
  templateUrl: './personal-user.component.html',
  styleUrls: ['./personal-user.component.css'],
})
export class PersonalUserComponent implements OnInit {
  nopost: string = '';
  localData!: string;
  idpost!: number;
  //idUser!: number;
  user!: User;
  post!: Post[];
  image: any;
  userImage!: any;
  userId!: string;
  title!: any;
  postInput!: any;
  page = 1;
  limit = 10;

  body = {
    age: '25',
    gender: 'male',
    email: 'Vega@gmail.com',
  };
  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';

  constructor(
    public dialog: MatDialog,
    private postService: postService,
    private userService: userService
  ) {}
  ngOnInit(): void {
    this.getPersonalUserInfo();
  }

  getPersonalUserInfo() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.user = data;
      this.userId = this.user._id;
      if (this.user.image) {
        this.userService
          .getUserImage(this.userId)
          .subscribe((response: Blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
              this.userImage = reader.result;
            };
          });
      } else {
        this.userImage =
          this.user.gender === 'female' ? this.photoGirl2 : this.photoMan2;
      }
      this.postService.getPostbyId(this.userId).subscribe((data: any) => {
        if (data.length === 0) {
          this.nopost = 'There are no Posts yet';
        } else {
          this.post = data;
          console.log(data);
        }
      });
    });
  }
  openDialog() {
    const opendialog = this.dialog.open(CreateUserComponent);
    opendialog.afterClosed().subscribe((result: any) => {
      location.reload();
    });
  }

  onSubmit(form: NgForm) {
    const title: string = form.value.title;
    const body: string = form.value.post;

    this.postService
      .postPost({ post: body, title: title })
      .subscribe((data) => {
        this.getPersonalUserInfo();
      });
  }
  clear() {
    setTimeout(() => {
      this.title = '';
      this.postInput = '';
    }, 1500);
  }
}
