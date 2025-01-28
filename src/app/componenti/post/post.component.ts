import { Component, OnInit } from '@angular/core';
import { AddPostDto, Post } from 'src/app/modelli/interface';
import { NgForm } from '@angular/forms';
import { postService } from 'src/app/service/postService/post.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { userService } from 'src/app/service/userService/user.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    standalone: false
})
export class PostComponent implements OnInit {
  constructor(
    private postService: postService,
    private router: Router,
    private userService: userService
  ) {}
  userId!: string;
  Allpost: Post[] = [];
  pageFirst = 1;
  page = 1;
  limit = 5;
  totalPosts = 0;
  currentPage = 0;
  remainingPosts = 0;
  selectedFile: File | null = null;
  isSubmitting = false;
  PostDto: AddPostDto = new AddPostDto();
  isLoading = false;
  logUserId!: string;
  imagePreview!: any
  

  Allpost$!: Observable<Post[]>;
  loadPostsSubject = new BehaviorSubject<void>(undefined);
  ngOnInit(): void {

console.log(Date.parse("2019-01-01"),
Date.parse("2019-01-01T00:00:00.000Z"),
Date.parse("2019-01-01T00:00:00.000+00:00"))



    this.getAllPost();
    // this.getAllPostObs();
    this.getLogUser();
  }
  getLogUser() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.logUserId = data._id;
    });
  }
  // getAllPostObs() {
  //   this.Allpost$ = this.loadPostsSubject.pipe(
  //     switchMap(() => {
  //       this.isLoading = true;
  //       return this.postService.getPost(this.page, this.limit).pipe(
  //         tap((data: any) => {
  //           this.totalPosts = data.totalPosts;
  //           this.isLoading = false;
  //           this.Allpost = data.post;
  //           console.log(this.Allpost);
  //           this.calculateRemainingPosts();
  //         })
  //       );
  //     })
  //   );
  // }

  getAllPost() {
    this.isLoading = true;
    this.postService
      .getPost(this.page, this.limit)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe((data: any) => {
        this.Allpost = data.post;
        this.totalPosts = data.totalPosts;
        this.calculateRemainingPosts();
        this.isLoading = false;
      });
  }

  // Il limite di post caricati inizialmente è 10 e poi tramite pulsante ne carica di 10 in 10
  loadMorePosts(): void {
    this.page++;
    this.postService.getPost(this.page, this.limit).subscribe((data: any) => {
      this.Allpost = [...this.Allpost, ...data.post];
      this.totalPosts = data.totalPosts;
      this.calculateRemainingPosts();
    });
  }

  calculateRemainingPosts(): void {
    this.remainingPosts = this.totalPosts - this.Allpost.length;
  }

  onSubmit(form: NgForm) {
    this.isSubmitting = true;
    this.postService.postPost(this.PostDto).subscribe((data: any) => {
      console.log(data)
      if (this.selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', this.selectedFile!);
        this.postService.postPhotoPost(data._id, formDataImage).subscribe((data) => {
          this.postService
            .getPost(this.pageFirst, this.limit)
            .subscribe((data: any) => {
              this.Allpost = data.post;
              this.totalPosts = data.totalPost;
              this.PostDto = new AddPostDto();
              this.clearImagePreview()
              this.isSubmitting = false;
              this.page = 1;
              console.log(data)
            });
        })
      } else {
        this.postService
          .getPost(this.pageFirst, this.limit)
          .subscribe((data: any) => {
            this.Allpost = data.post;
            this.totalPosts = data.totalPost;
            this.PostDto = new AddPostDto();
            this.isSubmitting = false;
            this.page = 1;
          })
      }});
  }

  onSearch(form: NgForm) {
    this.postService
      .getPostBySearch(this.PostDto.search)
      .subscribe((data: any) => {
        this.Allpost = data.post;
        this.totalPosts = data.post.length;
        this.calculateRemainingPosts();
        if (!this.PostDto.search) {
          this.page = 1;
          this.getAllPost();
        }
      });
  }
  // dopo aver cancellato un post ricarica i post per visualizzare subito l'array nuovo
  onPostDeleted() {
    this.postService
      .getPost(this.pageFirst, this.limit)
      .subscribe((data: any) => {
        this.Allpost = data.post;
        this.totalPosts = data.totalPosts;
        this.page = 1;
        this.calculateRemainingPosts();
      });
  }

  // token scaduto torna al log-in
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

  // uploadImage(image : any) {
  //   console.log("ciao")
  // }
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
  // uploadImage(event: any): void {
  //   const selectedFile = event.target.files[0];
  //   if (!selectedFile) {
  //     console.log('Nessun file selezionato.');
  //     this.selectedImageName = null;
  //     return;
  //   }
  //   this.selectedImageName = selectedFile.name;
  //   const formData = new FormData();
  //   formData.append('image', selectedFile);
  //   this.userService.updateImage(formData).subscribe((res: any) => {});
  // }
  // uploadImage(event: any): void {
  //   const selectedFile = event.target.files[0];
  //   if (!selectedFile) {
  //     console.log('Nessun file selezionato.');
  //     this.selectedFile = null;
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('image', selectedFile);
  //   this.postService.postPhotoPost(formData).subscribe((res: any) => {});
  // }
}
