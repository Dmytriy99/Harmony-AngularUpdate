import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Comment, CommentDto, User } from 'src/app/modelli/interface';
import { CommentService } from 'src/app/service/commentService/comment.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { SoketService } from 'src/app/service/soketService/soket.service';

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
    standalone: false
})
export class CommentiComponent implements OnInit {
  commentFormReactive!: FormGroup
  dataLocal: any;
  user!: User;
  comment: Comment[] = [];
  body!: string;
  @Input() postId!: number;
  commentDto: CommentDto = new CommentDto();
  isSend = false;
  //@Output() commentPost: EventEmitter<void> = new EventEmitter<void>();
  @Input() isCommentVisible!: any ;
  constructor(private commentService: CommentService,private soketService: SoketService, fb:FormBuilder) {
    this.commentFormReactive = fb.group({
      content: [''],
    })
  }
  // visualizzazione commenti
  ngOnInit(): void {
    if (this.postId) {
      this.commentService.getCommentById(this.postId).subscribe((data: any) => {
        this.comment = data;
        //console.log(this.comment)
      });
      this.setupSocketConnection()
    }
  }

  setupSocketConnection() {
    const socket = this.soketService.getSocket();

    socket.on('newComment', (comment: any) => {
      if(this.postId === comment.postId){
        console.log('Nuovo Commento : ', comment.comment);
    }}); 
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


  emojiList: string[] = ['😀', '😂', '😍', '🤔', '😎', '😭', '👍', '🎉', '🔥', '💯'];
showEmojiPicker = false;

addEmoji(emoji: string) {
  this.commentDto.content = (this.commentDto.content || '') + emoji;
}

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}
}
