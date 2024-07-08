import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User, UserDto } from 'src/app/modelli/interface';
import { httpOption2 } from 'src/app/service/api.export';

import { userService } from 'src/app/service/userService/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  textError!: string;
  textCreate!: string;
  description: string = '';
  selectedImageName: string | null = null;
  userDto: UserDto = new UserDto();
  constructor(private userService: userService) {}
  ngOnInit(): void {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.userDto.description = data.description;
    });
  }
  onSubmit(form: NgForm) {
    this.userService.updateUserInfo(this.userDto).subscribe({
      next: (data) => {
        this.textCreate = 'User info update successfully';
      },
      error: (error) => {
        console.error('Errore durante la richiesta:', error);
        if (error.status === 422) {
          this.textError = 'Fail to Update';
        }
      },
    });
  }
  uploadImage(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.log('Nessun file selezionato.');
      this.selectedImageName = null;
      return;
    }
    this.selectedImageName = selectedFile.name;
    const formData = new FormData();
    formData.append('image', selectedFile);
    this.userService.updateImage(formData).subscribe((res: any) => {});
  }
}
