import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Comment, User } from 'src/app/modelli/interface';
import { CommentService } from 'src/app/service/commentService/comment.service';

@Component({
  selector: 'app-commenti',
  templateUrl: './commenti.component.html',
  styleUrls: ['./commenti.component.css'],
})
export class CommentiComponent implements OnInit {
  dataLocal: any;
  user!: User;
  comment: Comment[] = [];
  body!: string;

  noComment: string = '';
  @Input() postId!: number;
  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.postId) {
      // this.dataLocal = localStorage.getItem('user');
      // this.user = JSON.parse(this.dataLocal);
      this.commentService.getCommentById(this.postId).subscribe((data: any) => {
        if (data.length === 0) {
          this.noComment = 'There are no comments yet';
        } else {
          this.comment = data;
          console.log(data);
        }
      });
    }
  }

  onSubmit(form: NgForm) {
    // if (this.user && this.user.email) {
    const body = form.value.body;
    // const email = this.user.email;
    // const name = this.user.name;
    this.commentService
      .postComment(
        {
          content: body,
          // email: email,
          // name: name,
          post_id: 12345,
        },
        this.postId
      )
      .subscribe((data) => {
        this.commentService
          .getCommentById(this.postId)
          .subscribe((data: any) => {
            this.comment = data;
            this.noComment = '';
          });
      });
    //}
  }
  clear() {
    setTimeout(() => {
      this.body = '';
    }, 1500);
  }
}
