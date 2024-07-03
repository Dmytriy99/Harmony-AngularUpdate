import { Component, ElementRef, OnInit } from '@angular/core';
import { Post } from 'src/app/modelli/interface';
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
  title!: string;
  post!: string;
  Allpost: Post[] = [];
  page = 1;
  limit = 10;
  totalPosts = 0;
  currentPage = 0;
  remainingPosts = 0;

  selectedFile: File | null = null;

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
      this.Allpost = [...this.Allpost, ...data.post];
      this.totalPosts = data.totalPosts;
      this.calculateRemainingPosts();
    });
  }

  calculateRemainingPosts(): void {
    this.remainingPosts = this.totalPosts - this.Allpost.length;
  }

  // getAllPost(pageIndex: number, pageSize: number) {
  //   this.postService
  //     .getAllPostByIndex(this.pageIndex, this.pageSize)
  //     .subscribe((data: any) => {
  //       this.Allpost = data;
  //       console.log(data);
  //     });
  // }
  onSubmit(form: NgForm) {
    const title: string = form.value.title;
    const body: string = form.value.post;

    this.postService
      .postPost({ post: body, title: title })
      .subscribe((data) => {
        this.postService
          .getPost(this.page, this.limit)
          .subscribe((data: any) => {
            this.Allpost = data.post;
            this.totalPosts = data.totalPost;
          });
      });
  }

  onSearch(form: NgForm) {
    const title: string = form.value.search;
    this.postService.getPostBySearch(title).subscribe((data: any) => {
      this.Allpost = data.post;
      this.totalPosts = data.post.length;
      this.calculateRemainingPosts();
      if (!title) {
        this.getAllPost();
      }
    });
  }
  // onSearch(form: NgForm) {
  //   const title = form.value.title;

  //   this.postService.getBySearch(title).subscribe((data: any) => {
  //     this.Allpost = data;
  //   });
  // }
  // back() {
  //   window.location.reload();
  // }

  // selectPage(e: PageEvent) {
  //   this.pageEvent = e;
  //   this.pageIndex = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.getAllPost(this.pageIndex, this.pageSize);
  // }

  clear() {
    setTimeout(() => {
      this.title = '';
      this.post = '';
    }, 1500);
  }
  // getLenght() {
  //   this.http
  //     .get(`${urlPost}`, {
  //       ...httpOption,
  //       observe: 'response',
  //     })
  //     .subscribe((data) => {
  //       this.lenghtPost = data.headers.get('x-pagination-total');
  //     });
  // }
}
