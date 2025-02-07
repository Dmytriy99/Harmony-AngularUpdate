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
    standalone: false
})
export class UserComponent implements OnInit {
  logUser: any
  noPost!: string;
  idUser: string = this.route.snapshot.paramMap.get('id')!;
  user!: User;
  post!: Post[];
  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';
  userImage: { [key: string]: string } = {};
  imageLoading = false

  disableButton: boolean = false

  buttonText: any

  friends : any
  constructor(
    private route: ActivatedRoute,
    private postService: postService,
    private userService: userService
  ) {}
  ngOnInit(): void {
   this.logUser = localStorage.getItem('user');
   console.log(this.logUser)
    this.route.paramMap.subscribe(params => {
      this.idUser = params.get('id')!;
      this.post = []
      if (this.idUser) {
        this.userService.getUserById(this.idUser).subscribe((data: any) => {
          this.user = data;
          console.log(this.user)
          // if (this.user.notification.some((request: any) => request.userId === this.logUser && request.type === 'friendRequest')) {
          //   this.buttonText = 'Richiesta di amicizia inviata';
          //   this.disableButton = true
          // } else 
          if ( this.user.friends.includes(this.logUser)){
            this.buttonText = 'Siete amici';
            this.disableButton = true
          }  else if ( this.user.sentRequests.includes(this.logUser)){
            this.buttonText = 'Ti ha già invitato la richiesta di amicizia';
            this.disableButton = true
          } else {
            this.buttonText = 'Invia richiesta di amicizia';
            this.disableButton = false
          }
          console.log(this.user)
          if (this.user.imageId) {
            this.getUserImage(this.user.imageId);
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
  });
  }
  getUserImage(userId: string) {
    this.imageLoading = true
    this.userService.getUserImage(userId).subscribe({
      next: (response: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          this.userImage[userId] = reader.result as string;
          this.imageLoading = false
        };
      },
      error: (error) => {
        console.error('errore', error);
      },
    });
  }

  sendFriendRequest(userId: string) {
    console.log(userId)
    this.userService.sendFriendRequest2(userId).subscribe(data => {
    });
  }
  removeFriend(userId: string) {
    console.log(userId)
    this.userService.removeFriend(userId).subscribe(data => {});
  }
}
