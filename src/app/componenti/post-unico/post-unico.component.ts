import { Component, OnInit, Input } from '@angular/core';

import { catchError, of } from 'rxjs';
import { Post } from 'src/app/modelli/interface';
import { postService } from 'src/app/service/postService/post.service';

import { userService } from 'src/app/service/userService/user.service';
@Component({
  selector: 'app-post-unico',
  templateUrl: './post-unico.component.html',
  styleUrls: ['./post-unico.component.css'],
})
export class PostUnicoComponent implements OnInit {
  error: string = 'Utente non Trovato';
  userName!: string;
  userEmail!: string;
  useriD!: number;
  @Input() post!: any;
  iDpost!: number;
  user!: number;
  title!: string;
  body!: string;

  constructor(
    private userService: userService,
    private postService: postService
  ) {}
  ngOnInit(): void {
    if (this.post) {
      this.title = this.post.title;
      this.body = this.post.post;
      this.iDpost = this.post._id;
      this.userService
        .getUserById(this.post.userId)
        .pipe(catchError(() => of(this.error)))
        .subscribe((data: any) => {
          //console.log(this.iDpost);
          if (data !== this.error) {
            this.userName = data.name;
            this.userEmail = data.email;
          } else {
            this.userName = this.error;
          }
        });
    }
  }
  like() {
    this.postService.postLike(this.post._id).subscribe((data: any) => {
      console.log(data);
      this.post.likes = data.likes;
    });
  }
}
