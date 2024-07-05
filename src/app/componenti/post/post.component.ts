import { Component, OnInit } from '@angular/core';
import { AddPostDto, Post } from 'src/app/modelli/interface';
import { NgForm } from '@angular/forms';
import { postService } from 'src/app/service/postService/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  constructor(private postService: postService) {}
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

  ngOnInit(): void {
    this.getAllPost();
  }
  getAllPost() {
    this.postService.getPost(this.page, this.limit).subscribe((data: any) => {
      console.log(data);
      this.Allpost = data.post;
      this.totalPosts = data.totalPosts;
      this.calculateRemainingPosts();
    });
  }
  loadMorePosts(): void {
    this.page++;
    this.postService.getPost(this.page, this.limit).subscribe((data: any) => {
      console.log(data);
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
}
