import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDto } from 'src/app/modelli/interface';

import { userService } from 'src/app/service/userService/user.service';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.css'],
    standalone: false
})
export class CreateUserComponent implements OnInit {
  textError!: string;
  textCreate!: string;
  description: string = '';
  selectedImageName: string | null = null;

  userDto: UserDto = new UserDto();
  constructor(private userService: userService) {}
  // informazioni utente loggato
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
        console.error('Errore durante la richiesta:', error.error);
        this.textError = error.error;
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
