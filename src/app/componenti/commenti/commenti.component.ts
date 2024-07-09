import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Comment, CommentDto, User } from 'src/app/modelli/interface';
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
  @Input() postId!: number;
  commentDto: CommentDto = new CommentDto();
  isSend = false;
  constructor(private commentService: CommentService) {}
  // visualizzazione commenti
  ngOnInit(): void {
    if (this.postId) {
      this.commentService.getCommentById(this.postId).subscribe((data: any) => {
        this.comment = data;
      });
    }
  }
  // post commenti e visualizzazione nuovo commento
  onSubmit(form: NgForm) {
    this.isSend = true;
    this.commentService
      .postComment(this.commentDto, this.postId)
      .subscribe((data) => {
        this.commentDto = new CommentDto();
        this.isSend = false;
        this.commentService
          .getCommentById(this.postId)
          .subscribe((data: any) => {
            this.comment = data;
          });
      });
  }
}
