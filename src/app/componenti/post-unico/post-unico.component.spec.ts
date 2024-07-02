import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostUnicoComponent } from './post-unico.component';
import { userService } from 'src/app/service/userService/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentiComponent } from '../commenti/commenti.component';

describe('PostUnicoComponent', () => {
  let component: PostUnicoComponent;
  let fixture: ComponentFixture<PostUnicoComponent>;
  let userServiceSpy: jasmine.SpyObj<userService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('userService', ['getUserByID']);

    TestBed.configureTestingModule({
      declarations: [PostUnicoComponent, CommentiComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: userService, useValue: spy }],
    }).compileComponents();

    userServiceSpy = TestBed.inject(userService) as jasmine.SpyObj<userService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user details when post is provided', () => {
    const mockPost = {
      id: 1,
      title: 'Test Title',
      body: 'Test Body',
      user_id: 123,
    };

    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    userServiceSpy.getUserByID.and.returnValue(of(mockUser));

    component.post = mockPost;
    component.ngOnInit();

    expect(component.title).toEqual(mockPost.title);
    expect(component.body).toEqual(mockPost.body);
    expect(component.iDpost).toEqual(mockPost.id);

    fixture.detectChanges();

    expect(component.userName).toEqual(mockUser.name);
    expect(component.userEmail).toEqual(mockUser.email);
  });

  it('should handle error when user service fails', () => {
    const mockPost = {
      id: 1,
      title: 'Test Title',
      body: 'Test Body',
      user_id: 123,
    };

    userServiceSpy.getUserByID.and.returnValue(of(component.error));

    component.post = mockPost;
    component.ngOnInit();

    expect(component.title).toEqual(mockPost.title);
    expect(component.body).toEqual(mockPost.body);
    expect(component.iDpost).toEqual(mockPost.id);

    fixture.detectChanges();

    expect(component.userName).toEqual(component.error);
  });
});
