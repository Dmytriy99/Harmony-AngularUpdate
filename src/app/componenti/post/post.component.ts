import { Component, OnInit } from '@angular/core';
import { AddPostDto, Post } from 'src/app/modelli/interface';
import { NgForm } from '@angular/forms';
import { postService } from 'src/app/service/postService/post.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  constructor(private postService: postService, private router: Router) {}
  userId!: String;
  Allpost: Post[] = [];
  pageFirst = 1;
  page = 1;
  limit = 10;
  totalPosts = 0;
  currentPage = 0;
  remainingPosts = 0;
  selectedFile: File | null = null;
  isSubmitting = false;
  PostDto: AddPostDto = new AddPostDto();
  isLoading = false;

  ngOnInit(): void {
    this.getAllPost();
  }
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
    this.postService.postPost(this.PostDto).subscribe((data) => {
      this.postService
        .getPost(this.pageFirst, this.limit)
        .subscribe((data: any) => {
          this.Allpost = data.post;
          this.totalPosts = data.totalPost;
          this.PostDto = new AddPostDto();
          this.isSubmitting = false;
          this.page = 1;
        });
    });
  }

  onSearch(form: NgForm) {
    this.postService
      .getPostBySearch(this.PostDto.search)
      .subscribe((data: any) => {
        this.Allpost = data.post;
        this.totalPosts = data.post.length;
        this.calculateRemainingPosts();
        if (!this.PostDto.search) {
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
      this.router.navigate(['/login']); // Assumendo che il path della pagina di login sia '/login'
    }
    return throwError(() => new Error('Token expired'));
  }
}
