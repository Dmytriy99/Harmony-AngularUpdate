import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentiComponent } from './commenti.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from 'src/app/service/commentService/comment.service';

import { User, Comment } from 'src/app/modelli/interface';
import { of } from 'rxjs';

describe('CommentiComponent', () => {
  let component: CommentiComponent;
  let fixture: ComponentFixture<CommentiComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CommentService', [
      'getComment',
      'postComment',
    ]);

    TestBed.configureTestingModule({
      declarations: [CommentiComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        FormsModule,
      ],
      providers: [{ provide: CommentService, useValue: spy }],
    }).compileComponents();

    commentServiceSpy = TestBed.inject(
      CommentService
    ) as jasmine.SpyObj<CommentService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments when postId is provided', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      status: 'Active',
    };
    const mockComments: Comment[] = [
      {
        id: 1,
        content: 'Test comment',
        email: 'john.doe@example.com',
        name: 'John Doe',
        post_id: 1,
      },
    ];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    commentServiceSpy.getComment.and.returnValue(of(mockComments));

    component.postId = 1;
    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
    expect(commentServiceSpy.getComment).toHaveBeenCalledWith(1);
    expect(component.comment).toEqual(mockComments);
    expect(component.noComment).toEqual('');
  });

  it('should display "No comments" message when there are no comments', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      status: 'Active',
    };

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    commentServiceSpy.getComment.and.returnValue(of([]));

    component.postId = 1;
    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
    expect(commentServiceSpy.getComment).toHaveBeenCalledWith(1);
    expect(component.comment).toEqual([]);
    expect(component.noComment).toEqual('There are no comments yet');
  });
});
