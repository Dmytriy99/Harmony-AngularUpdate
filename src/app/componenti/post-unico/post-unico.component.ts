import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { catchError, forkJoin, of } from 'rxjs';
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
  @Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();
  iDpost!: number;
  user!: number;
  title!: string;
  body!: string;
  nameLikes!: string;
  logUserId!: string;

  constructor(
    private userService: userService,
    private postService: postService
  ) {}
  ngOnInit(): void {
    if (this.post) {
      this.getPost();
    }
    this.getLogUser();
  }
  getPost() {
    this.title = this.post.title;
    this.body = this.post.post;
    this.iDpost = this.post._id;
    this.getNameLikes();
    //console.log(this.post.likedBy);
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
  getLogUser() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.logUserId = data._id;
    });
  }
  getNameLikes(): void {
    if (!this.post.likedBy || this.post.likedBy.length === 0) {
      this.nameLikes = '';
      return;
    }

    const observables = this.post.likedBy.map((userId: any) =>
      this.userService.getUserById(userId)
    );

    forkJoin(observables).subscribe({
      next: (users: any) => {
        const names = users.map((user: any) => user.name);
        if (names.length <= 3) {
          this.nameLikes = names.join(', ');
        } else {
          this.nameLikes = `${names.slice(0, 3).join(', ')} +${
            names.length - 3
          }`;
        }
      },
      error: (error: any) => {
        console.error('Errore nel recuperare i nomi degli utenti:', error);
      },
    });
  }
  like() {
    this.postService.postLike(this.post._id).subscribe((data: any) => {
      this.post.likes = data.likes;
      this.post.likedBy = data.likedBy;
      this.getNameLikes();
    });
  }
  delatePost() {
    this.postService.delatePost(this.post._id).subscribe((data: any) => {
      console.log(data);
      this.postDeleted.emit();
    });
  }
  canDeletePost(): boolean {
    return this.post.userId === this.logUserId;
  }
}
