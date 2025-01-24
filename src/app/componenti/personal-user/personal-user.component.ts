import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AddPostDto, Post, User } from 'src/app/modelli/interface';
import { MatDialog } from '@angular/material/dialog';
import { postService } from 'src/app/service/postService/post.service';

import { userService } from 'src/app/service/userService/user.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { NgForm } from '@angular/forms';
import { token } from 'src/app/service/api.export';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-personal-user',
    templateUrl: './personal-user.component.html',
    styleUrls: ['./personal-user.component.css'],
    standalone: false
})
export class PersonalUserComponent implements OnInit {
  nopost: string = '';
  localData!: string;
  user!: User;
  post!: Post[];
  userImage!: any;
  userId!: string;
  page = 1;
  limit = 10;
  PostDto: AddPostDto = new AddPostDto();
  isSubmitting = false;
  @Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();
  isLoading = false;
  imageID!: any
  imageLoading = false
  imagePreview!: any
  selectedFile: File | null = null;

  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';

  constructor(
    public dialog: MatDialog,
    private postService: postService,
    private userService: userService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const localtoken = localStorage.getItem('token');
    if (localtoken == token) {
      this.getPersonalUserInfo();
    } else {
      location.reload();
    }
  }
  // carica informazioni dati User loggato, se non è presente una photo carica una di default in base al gender
  getPersonalUserInfo() {
    this.isLoading = true;
    this.userService
      .getUserInfo()
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe((data: any) => {
        this.user = data;
        this.userId = this.user._id;
        this.imageID = this.user.imageId
        if (this.user.imageId) {
          this.imageLoading= true
          this.userService
            .getUserImage(this.imageID)
            .subscribe((response: Blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => {
                this.userImage = reader.result;
              };
              this.imageLoading= false
            });
        } else {
          this.userImage =
            this.user.gender === 'female' ? this.photoGirl2 : this.photoMan2;
        }
        this.getAllPost();
        this.isLoading = false;
      });
  }
  getAllPost() {
    this.postService.getPostbyId(this.userId).subscribe((data: any) => {
      if (data.length === 0) {
        this.nopost = 'There are no Posts yet';
      } else {
        this.post = data;
      }
    });
  }
  openDialog() {
    const opendialog = this.dialog.open(CreateUserComponent);
    opendialog.afterClosed().subscribe((result: any) => {
      location.reload();
    });
  }

  // onSubmit(form: NgForm) {
  //   this.isSubmitting = true;
  //   this.postService.postPost(this.PostDto).subscribe((data) => {
  //     this.getPersonalUserInfo();
  //     this.PostDto = new AddPostDto();
  //     this.isSubmitting = false;
  //     this.isLoading = false;
  //     this.nopost = '';
  //   });
  // }
  onSubmit(form: NgForm) {
    this.isSubmitting = true;
    this.postService.postPost(this.PostDto).subscribe((data: any) => {
      if (this.selectedFile) {
        console.log(data)
        const formDataImage = new FormData();
        formDataImage.append('image', this.selectedFile!);
        this.postService.postPhotoPost(data._id, formDataImage).subscribe((data) => {
          this.getPersonalUserInfo();
          this.PostDto = new AddPostDto();
          this.clearImagePreview()
          this.isSubmitting = false;
          this.isLoading = false;
          this.nopost = '';
        });
      } else {
          this.getPersonalUserInfo();
          this.PostDto = new AddPostDto();
          this.isSubmitting = false;
          this.isLoading = false;
          this.nopost = '';
      }
    })
  }
  onPostDeleted() {
    if (this.post.length === 1) {
      this.post = [];
    }
    this.getAllPost();
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

  renderImagePreview(event: Event): void {
    console.log(this.imagePreview)
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file)
    if (file) {
      this.selectedFile = file
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Imposta l'anteprima
      };
      reader.readAsDataURL(file); // Legge il file e genera una data URL
    } else {
      this.imagePreview = null; // Rimuove l'anteprima se non c'è un file
    }
  }

  clearImagePreview(){
    this.imagePreview = null
    this.selectedFile = null
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Resetta il valore del file input
  }
}
}
