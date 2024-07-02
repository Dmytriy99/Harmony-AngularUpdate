import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PostComponent } from './post.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { postService } from 'src/app/service/postService/post.service';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let mockPostService: jasmine.SpyObj<postService>;

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('postService', [
      'getAllPostByIndex',
      'postPost',
      'getBySearch',
    ]);
    TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        HttpClientTestingModule,
        MatPaginatorModule,
      ],
      providers: [{ provide: postService, useValue: mockPostService }],
    }).compileComponents();
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all posts on initialization', () => {
    const mockPosts = [
      { id: 1, title: 'Test Title', body: 'Test Body', user_id: 1 },
    ];
    mockPostService.getAllPostByIndex.and.returnValue(of(mockPosts));

    component.ngOnInit();

    // expect(component.Allpost).toEqual(mockPosts);
    expect(mockPostService.getAllPostByIndex).toHaveBeenCalledWith(
      component.pageIndex,
      component.pageSize
    );
  });

  it('should search for posts', () => {
    const searchTitle = 'Test Search';
    const mockSearchResults = [
      { id: 1, title: 'Test Title', body: 'Test Body', user_id: 1 },
    ];
    mockPostService.getBySearch.and.returnValue(of(mockSearchResults));

    component.onSearch({ value: { title: searchTitle } } as any);

    expect(mockPostService.getBySearch).toHaveBeenCalledWith(searchTitle);
    //expect(component.Allpost).toEqual(mockSearchResults);
  });

  it('should clear form fields after a delay', fakeAsync(() => {
    component.clear();

    tick(1600);

    expect(component.title).toBe('');
    //expect(component.body).toBe('');
  }));

  // it('should change page and fetch new posts', () => {
  //   const pageEvent: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };
  //   spyOn(component, 'getAllPost');

  //   component.selectPage(pageEvent);

  //   expect(component.pageIndex).toBe(pageEvent.pageIndex);
  //   expect(component.pageSize).toBe(pageEvent.pageSize);
  //   expect(component.getAllPost).toHaveBeenCalledWith(
  //     pageEvent.pageIndex,
  //     pageEvent.pageSize
  //   );
  // });
});
