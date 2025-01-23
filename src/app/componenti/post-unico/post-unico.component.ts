import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { forkJoin } from 'rxjs';
import { postService } from 'src/app/service/postService/post.service';

import { userService } from 'src/app/service/userService/user.service';
@Component({
    selector: 'app-post-unico',
    templateUrl: './post-unico.component.html',
    styleUrls: ['./post-unico.component.css'],
    standalone: false
})
export class PostUnicoComponent implements OnInit {
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
  @Input() logUserId!: string;
  imagePost: any;

  //@Output() isCommentVisible = new EventEmitter<boolean>();

  isCommentVisible: boolean = false;

  constructor(
    private userService: userService,
    private postService: postService
  ) {}
  ngOnInit(): void {
    //console.log(this.post)
    if (this.post) {
      this.getPost();
      this.getUserInfo();
      //this.getLogUser();
      //this.getNameLikes();
    }
  }
  getPost() {
    this.title = this.post.title;
    this.body = this.post.post;
    this.iDpost = this.post._id;
    if (this.post.imageId) {
      this.postService.getPostImage(this.post.imageId,this.iDpost)
        .subscribe((response: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            this.imagePost = reader.result;
          };
        });
    }
  }

  getUserInfo() {
    if (this.post.userEmail || this.post.email) {
      this.userEmail = this.post.email;
      this.userName = this.post.userName;}
      // else {
    //   this.userService.getUserById(this.post.userId).subscribe((data: any) => {
    //     this.userName = data.name;
    //     this.userEmail = data.email;
    //   });
    // }
  }

  // prende gli id degli user nel dato "likedBy" e cerca il nome di ogni user tramite l'id e lo manda a schermo formattato
  // getNameLikes(): void {
  //   //   if (!this.post.likedBy || this.post.likedBy.length === 0) {
  //   //     this.nameLikes = '';
  //   //     return;
  //   //   }
  //   //   const reversedLikes = this.post.likedBy.slice().reverse();
  //   //   const observables = reversedLikes.map((userId: any) =>
  //   //     this.userService.getUserById(userId)
  //   //   );

  //   //   forkJoin(observables).subscribe({
  //   //     next: (users: any) => {
  //   //       const names = users.map((user: any) => user.name);
  //   //       if (names.length <= 3) {
  //   //         this.nameLikes = names.join(', ');
  //   //       } else {
  //   //         this.nameLikes = `${names.slice(0, 3).join(', ')} +${
  //   //           names.length - 3
  //   //         }`;
  //   //       }
  //   //     },
  //   //     error: (error: any) => {
  //   //       console.error('Errore nel recuperare i nomi degli utenti:', error);
  //   //     },
  //   //   });
  //   // Controlla se ci sono like
  //   if (!this.post.likedBy || this.post.likedBy.length === 0) {
  //     this.nameLikes = '';
  //     return;
  //   }

  //   // Se ci sono più ID che nomi, utilizziamo il vecchio metodo con gli ID
  //   if (this.post.likedBy.length > (this.post.likedByName?.length || 0)) {
  //     const reversedLikes = this.post.likedBy.slice().reverse();
  //     const observables = reversedLikes.map((userId: any) =>
  //       this.userService.getUserById(userId)
  //     );

  //     forkJoin(observables).subscribe({
  //       next: (users: any) => {
  //         const names = users.map((user: any) => user.name);
  //         if (names.length <= 3) {
  //           this.nameLikes = names.join(', ');
  //         } else {
  //           this.nameLikes = `${names.slice(0, 3).join(', ')} +${
  //             names.length - 3
  //           }`;
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Errore nel recuperare i nomi degli utenti:', error);
  //       },
  //     });
  //   }
  //   // Se gli ID sono uguali o inferiori ai nomi, usiamo il metodo con i nomi
  //   else if (this.post.likedByName && this.post.likedByName.length > 0) {
  //     const reversedNames = this.post.likedByName.slice().reverse();
  //     console.log(reversedNames);

  //     if (reversedNames.length <= 3) {
  //       this.nameLikes = reversedNames.join(', ');
  //     } else {
  //       this.nameLikes = `${reversedNames.slice(0, 3).join(', ')} +${
  //         reversedNames.length - 3
  //       }`;
  //     }
  //   }
  // }
  like() {
    this.postService.postLike(this.post._id).subscribe((data: any) => {
      this.post.likes = data.likes;
      this.post.likedBy = data.likedBy;
      //this.getNameLikes();
    });
  }
  delatePost() {
    this.postService.delatePost(this.post._id).subscribe((data: any) => {
      this.postDeleted.emit();
    });
  }
  getPostCount(){
    this.post.commentCount += 1
  }

  // se l'id Utente del post corrisponde all'id dell'Utente loggato visualizza il bottone per cancellare i propri post insieme a tutti i commenti
  canDeletePost(): boolean {
    return this.post.userId === this.logUserId;
  }
  openComments(){
    this.isCommentVisible = !this.isCommentVisible; // Alterna visibilità
  }
}
