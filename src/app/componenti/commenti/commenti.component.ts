import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal, TemplatePortal } from '@angular/cdk/portal';

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

  // emojiList: string[] = ['😀', '😂', '😍', '🤔', '😎', '😭', '👍', '🎉', '🔥', '💯'];
  emojiList: string[] = [
  '😀', '😂', '😍', '🤔', '😎', '😭', '👍', '🎉', '🔥', '💯',
  '🥳', '🙌', '😡', '😱', '🥺', '👏', '🤯', '🫡', '🙏', '💔',
  '😴', '😅', '😆', '😢', '😤', '😇', '😈', '🤮', '🤓', '😬',
  '🤗', '🫠', '😜', '🫶', '💩', '👀', '❤️', '💥', '👋', '🤝',
  '🧠', '🫀', '🦾', '🧨', '🍕', '☕', '🐱', '🐶', '🚀', '⚡'
];

  showEmojiPicker = false;


  @ViewChild('emojiMenu') emojiMenuRef!: TemplateRef<any>;
  @ViewChild('emojiTrigger') emojiTriggerRef!: ElementRef;

  overlayRef: OverlayRef | null = null;

  constructor(private commentService: CommentService,private soketService: SoketService, fb:FormBuilder,private overlay: Overlay, private vcr: ViewContainerRef) {
    this.commentFormReactive = fb.group({
      content: ['',Validators.required],
    })
  }

  ngAfterViewInit() {
    // nulla da fare qui per ora
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
  onSubmit() {
    this.isSend = true;
    const request: any = {
      content: this.commentFormReactive.get('content')?.value,
    }
    this.commentService
      .postComment(request, this.postId)
      .subscribe((data) => {
        this.commentFormReactive.reset();
        // this.commentDto = new CommentDto();
        this.isSend = false;
        this.commentService
          .getCommentById(this.postId)
          .subscribe((data: any) => {
            this.comment = data;
          });
      });
      //this.commentPost.emit()
  }
  // addEmoji(emoji: string) {
  //   this.commentFormReactive.get('content')?.setValue((this.commentFormReactive.get('content')?.value || '') + emoji);
  //   // this.commentDto.content = (this.commentDto.content || '') + emoji;
  // }

  // toggleEmojiPicker() {
  //   this.showEmojiPicker = !this.showEmojiPicker;
  // }
 toggleEmojiPicker(triggerElement: HTMLElement) {
  if (this.overlayRef) {
    this.overlayRef.dispose();
    this.overlayRef = null;
    return;
  }

  const positionStrategy = this.overlay
    .position()
    .flexibleConnectedTo(triggerElement)
    .withPositions([
      // {
      //   originX: 'start',
      //   originY: 'bottom',
      //   overlayX: 'start',
      //   overlayY: 'top',
      //   offsetY: 6
      // }
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top',offsetY: 6, offsetX: -18, },
    ])
    .withPush(false);

  this.overlayRef = this.overlay.create({
    positionStrategy,
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
    scrollStrategy: this.overlay.scrollStrategies.reposition(),
    panelClass: 'z-50'
  });

  const portal = new TemplatePortal(this.emojiMenuRef, this.vcr);
  this.overlayRef.attach(portal);

  this.overlayRef.backdropClick().subscribe(() => {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  });
}

  addEmoji(emoji: string) {
    const current = this.commentFormReactive.get('content')?.value || '';
    this.commentFormReactive.get('content')?.setValue(current + emoji);
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
