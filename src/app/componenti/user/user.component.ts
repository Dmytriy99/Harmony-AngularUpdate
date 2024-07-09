import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/modelli/interface';
import { postService } from 'src/app/service/postService/post.service';
import { userService } from 'src/app/service/userService/user.service';
import { User } from 'src/app/modelli/interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  noPost!: string;
  idUser: string = this.route.snapshot.paramMap.get('id')!;
  user!: User;
  post!: Post[];
  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';
  userImage: { [key: string]: string } = {};
  constructor(
    private route: ActivatedRoute,
    private postService: postService,
    private userService: userService
  ) {}
  ngOnInit(): void {
    if (this.idUser) {
      this.userService.getUserById(this.idUser).subscribe((data: any) => {
        this.user = data;
        if (this.user.image) {
          this.getUserImage(this.idUser);
        } else {
          this.userImage[this.idUser] =
            this.user.gender === 'female' ? this.photoGirl2 : this.photoMan2;
        }
      });
      this.postService.getPostbyId(this.idUser).subscribe((data: any) => {
        if (data.length === 0) {
          this.noPost = 'There are no Posts yet';
        } else {
          this.post = data;
        }
      });
    }
  }
  getUserImage(userId: string) {
    this.userService.getUserImage(userId).subscribe({
      next: (response: Blob) => {
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
}
