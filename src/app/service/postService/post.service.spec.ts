import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { postService } from './post.service';
import { urlUser, urlPost, httpOption } from '../api.export';

describe('postService', () => {
  let service: postService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [postService],
    });

    service = TestBed.inject(postService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to create a post', () => {
    const body = { title: 'Test Title', body: 'Test Body', user: 1 };
    const idUser = 1;

    service.postPost(body, idUser).subscribe();

    const req = httpTestingController.expectOne(`${urlUser}/${idUser}/posts`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });

  it('should make a GET request to search for posts', () => {
    const input = 'Test Search';

    service.getBySearch(input).subscribe();

    const req = httpTestingController.expectOne(`${urlPost}?title=${input}`);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a GET request to get all posts by index', () => {
    const pageIndex = 1;
    const pageSize = 10;

    service.getAllPostByIndex(pageIndex, pageSize).subscribe();

    const req = httpTestingController.expectOne(
      `${urlPost}?page=${pageIndex}&per_page=${pageSize}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a GET request to get posts by user ID', () => {
    const userId = 1;

    service.getPostById(userId).subscribe();

    const req = httpTestingController.expectOne(`${urlUser}/${userId}/posts`);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });
});
