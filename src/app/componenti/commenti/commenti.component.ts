import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Comment, CommentDto, User } from 'src/app/modelli/interface';
import { CommentService } from 'src/app/service/commentService/comment.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-commenti',
  templateUrl: './commenti.component.html',
  styleUrls: ['./commenti.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('350ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class CommentiComponent implements OnInit {
  dataLocal: any;
  user!: User;
  comment: Comment[] = [];
  body!: string;
  @Input() postId!: number;
  commentDto: CommentDto = new CommentDto();
  isSend = false;
  //@Output() commentPost: EventEmitter<void> = new EventEmitter<void>();
  @Input() isCommentVisible!: any ;
  constructor(private commentService: CommentService) {
  }
  // visualizzazione commenti
  ngOnInit(): void {
    if (this.postId) {
      this.commentService.getCommentById(this.postId).subscribe((data: any) => {
        this.comment = data;
        //console.log(this.comment)
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
      //this.commentPost.emit()
  }
}
