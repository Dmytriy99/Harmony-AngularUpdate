import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/modelli/interface';
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
  constructor(private userService: userService) {}
  ngOnInit(): void {
    this.userService.getUserInfo().subscribe((data: any) => {
      console.log(data);
      this.description = data.description;
    });
  }
  onSubmit(form: NgForm) {
    const name = form.value.name;
    const email = form.value.email;
    const gender = form.value.gender;
    const age = form.value.age;
    const description = form.value.description;
    const password = form.value.password;
    const address = form.value.address;
    this.userService
      .updateUserInfo({
        name: name,
        email: email,
        gender: gender,
        age: age,
        description: description,
        password: password,
        address: address,
      })
      .subscribe({
        next: (data) => {
          this.textCreate = 'User info update successfully';
          console.log(data);
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
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    this.userService.updateImage(formData).subscribe((res: any) => {
      console.log(res);
    });
  }
}
