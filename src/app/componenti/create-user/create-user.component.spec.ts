import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgForm } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { userService } from 'src/app/service/userService/user.service';
import { of, throwError } from 'rxjs';
describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let userServiceStub: jasmine.SpyObj<userService>;

  beforeEach(async () => {
    userServiceStub = jasmine.createSpyObj('userService', ['addUser']);
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
      ],
      declarations: [CreateUserComponent],
      providers: [{ provide: userService, useValue: userServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call userService.addUser when onSubmit is called', () => {
    const mockFormValue = {
      value: {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
      },
    };

    const mockUserResponse = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };

    userServiceStub.addUser.and.returnValue(of(mockUserResponse));

    component.onSubmit(mockFormValue as unknown as NgForm);

    expect(userServiceStub.addUser).toHaveBeenCalledWith({
      name: mockFormValue.value.name,
      email: mockFormValue.value.email,
      gender: mockFormValue.value.gender,
      status: 'active',
    });
  });
  it('should set textError when userService returns 422 error', () => {
    const mockFormValue = {
      value: {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
      },
    };

    userServiceStub.addUser.and.returnValue(throwError({ status: 422 }));

    component.onSubmit(mockFormValue as unknown as NgForm);

    expect(component.textError).toEqual(
      'You must input all the credentials or it is invalid'
    );
  });

  it('should not set textError when userService returns success', () => {
    const mockFormValue = {
      value: {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
      },
    };

    userServiceStub.addUser.and.returnValue(of({}));

    component.onSubmit(mockFormValue as unknown as NgForm);

    expect(component.textError).toBeUndefined();
  });
});
