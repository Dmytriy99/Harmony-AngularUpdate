import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { urlPost } from '../api.export';

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });

    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to get comments for a post', () => {
    const postId = 1;

    service.getComment(postId).subscribe();

    const req = httpTestingController.expectOne(
      `${urlPost}/${postId}/comments`
    );
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a POST request to post a comment for a post', () => {
    const body = { text: 'Test Comment' };
    const postId = 1;

    service.postComment(body, postId).subscribe();

    const req = httpTestingController.expectOne(
      `${urlPost}/${postId}/comments`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });
});
