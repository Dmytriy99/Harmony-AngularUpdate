import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { userService } from './user.service';
import { urlUser, httpOption } from '../api.export';

describe('userService', () => {
  let service: userService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [userService],
    });

    service = TestBed.inject(userService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a user', () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const gender = 'Male';
    const status = 'Active';

    service.createUser(name, email, gender, status);

    expect(service.user).toBeDefined();
    expect(service.user.name).toBe(name);
    expect(service.user.email).toBe(email);
    expect(service.user.gender).toBe(gender);
    expect(service.user.status).toBe(status);
  });

  it('should make a POST request to add a user', () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      gender: 'Male',
      status: 'Active',
    };

    service.addUser(body).subscribe();

    const req = httpTestingController.expectOne(urlUser);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });

  it('should make a GET request to get all users', () => {
    service.getUser().subscribe();

    const req = httpTestingController.expectOne(urlUser);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a GET request to get user by ID', () => {
    const userId = 1;

    service.getUserByID(userId).subscribe();

    const req = httpTestingController.expectOne(`${urlUser}/${userId}`);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a GET request to get users by index', () => {
    const pageIndex = 1;
    const pageSize = 10;

    service.getUserbyIndex(pageIndex, pageSize).subscribe();

    const req = httpTestingController.expectOne(
      `${urlUser}?page=${pageIndex}&per_page=${pageSize}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should make a DELETE request to delete a user', () => {
    const userId = 1;

    service.deleteUser2(userId).subscribe();

    const req = httpTestingController.expectOne(`${urlUser}/${userId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });

  it('should make a GET request to get user by name', () => {
    const input = 'Test Name';

    service.getUserBySearch(input).subscribe();

    const req = httpTestingController.expectOne(`${urlUser}?name=${input}`);
    expect(req.request.method).toEqual('GET');

    req.flush({});
  });
});
