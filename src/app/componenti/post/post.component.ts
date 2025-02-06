import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddPostDto, Post } from 'src/app/modelli/interface';
import { NgForm } from '@angular/forms';
import { postService } from 'src/app/service/postService/post.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { userService } from 'src/app/service/userService/user.service';
import { io } from 'socket.io-client';  // 🔥 Importa Socket.IO client
import { SoketService } from 'src/app/service/soketService/soket.service';


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    standalone: false
})
export class PostComponent implements OnInit {
  @ViewChild('postContainer', { static: true }) postContainer!: ElementRef;
  constructor(
    private postService: postService,
    private router: Router,
    private userService: userService,
    private soketService: SoketService
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
  isLoadingNewPost: any = false
  userImage!: any
  imageLoading= false

  private socket: any; // 🔥 Variabile per il socket
  
  photoGirl2: string =
    'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
  photoMan2: string =
    'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';

  Allpost$!: Observable<Post[]>;
  loadPostsSubject = new BehaviorSubject<void>(undefined);
  ngOnInit(): void {
    this.getAllPost();
    // this.getAllPostObs();
    this.getLogUser();
    this.postContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    const socket = this.soketService.getSocket();

    socket.on('newPost', (post: Post) => {
      console.log('Nuovo post ricevuto:', post);
      this.Allpost.unshift(post); // Aggiungi il nuovo post in cima alla lista
      this.calculateRemainingPosts();
    });

    // Quando un post viene eliminato
    socket.on('postDeleted', (data: { postId: string }) => {
    console.log("Post eliminato:", data.postId);
    this.onPostDeleted()
    // this.Allpost = this.Allpost.filter((post:any) => post._id !== data.postId);
    // this.calculateRemainingPosts();
    // console.log(this.Allpost)
  });
  }
  getLogUser() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.logUserId = data._id;
      this.userImage = data.imageId
      if (this.userImage) {
        this.imageLoading = true
        this.userService
          .getUserImage(this.userImage)
          .subscribe((response: Blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
              this.userImage = reader.result;
            };
            this.imageLoading = false
          });
      } else {
        this.userImage =
          data.gender === 'female' ? this.photoGirl2 : this.photoMan2;
      }
    }
    );
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
        console.log(data.post)
        this.Allpost = data.post;
        this.totalPosts = data.totalPosts;
        this.calculateRemainingPosts();
        this.isLoading = false;
      });
  }

  onScroll(): void {
    const container = this.postContainer.nativeElement;

    // Controlla se lo scroll è arrivato in fondo
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      if (this.remainingPosts > 0) {
        this.loadMorePosts(); // Scatena il caricamento di altri post
      }
    }
  }

  // Il limite di post caricati inizialmente è 10 e poi tramite pulsante ne carica di 10 in 10
  loadMorePosts(): void {
    this.isLoadingNewPost = true
    this.page++;
    this.postService.getPost(this.page, this.limit).subscribe((data: any) => {
      this.Allpost = [...this.Allpost, ...data.post];
      this.totalPosts = data.totalPosts;
      console.log(this.Allpost);
      this.calculateRemainingPosts();
      this.isLoadingNewPost= false
    });
  }

  calculateRemainingPosts(): void {
    this.remainingPosts = this.totalPosts - this.Allpost.length;
  }

  onSubmit(form: NgForm) {
    this.isSubmitting = true;
    if(!this.selectedFile) {this.PostDto.image = "false"
    }else{this.PostDto.image = "true"}
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
