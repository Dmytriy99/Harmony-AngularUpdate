import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { userService } from 'src/app/service/userService/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatRadioModule,
      ],
      declarations: [UsersComponent, CreateUserComponent],
      providers: [
        userService,
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserBySearch when onSearch is called with selectedOption as "1"', () => {
    const userServiceSpy = spyOn(
      TestBed.inject(userService),
      'getUserBySearch'
    ).and.returnValue(of([]));
    const form: NgForm = { value: { title: 'test' } } as NgForm;
    component.selectedOption = '1';

    component.onSearch(form);

    expect(userServiceSpy).toHaveBeenCalledWith(form.value.title);
  });

  it('should call getUserBySearchEmail when onSearch is called with selectedOption as "2"', () => {
    const userServiceSpy = spyOn(
      TestBed.inject(userService),
      'getUserBySearchEmail'
    ).and.returnValue(of([]));
    const form: NgForm = { value: { title: 'test' } } as NgForm;
    component.selectedOption = '2';

    component.onSearchEmail(form);

    expect(userServiceSpy).toHaveBeenCalledWith(form.value.title);
  });

  it('should update pageIndex, pageSize, and call getAllUser when selectPage is called', () => {
    const pageIndex = 2;
    const pageSize = 25;
    const pageEvent: PageEvent = { pageIndex, pageSize, length: 100 };

    const getAllUserSpy = spyOn(component, 'getAllUser');

    // component.selectPage(pageEvent);

    // expect(component.pageIndex).toBe(pageIndex);
    // expect(component.pageSize).toBe(pageSize);
    // expect(getAllUserSpy).toHaveBeenCalledWith(pageIndex, pageSize);
  });
});
