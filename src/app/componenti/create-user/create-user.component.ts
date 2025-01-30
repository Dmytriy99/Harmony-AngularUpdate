import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selectedImage: File | null = null;
  user: any
  userImage: any
  imageLoading = false
  closingDialig = false

  userDto: UserDto = new UserDto();
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,private userService: userService,private dialogRef: MatDialogRef<CreateUserComponent>) {
    if(dialogData) 
      this.user = dialogData.user;
    this.userImage = dialogData.userImage
  }
  // informazioni utente loggato

  @ViewChild('fileInput') fileInput!: ElementRef;

triggerFileInput() {
  this.fileInput.nativeElement.click(); // Simula il click sull'input file nascosto
}
  ngOnInit(): void {
    this.userDto.description = this.user.description
    console.log(this.user)
    if (this.user.imageId) {
      this.imageLoading= true
      this.userService
        .getUserImage(this.user.imageId)
        .subscribe((response: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            this.userImage = reader.result;
          };
          this.imageLoading= false
        });
  }
}

  onSubmit(form: NgForm) {
    this.userService.updateUserInfo(this.userDto).subscribe({
      next: (data) => {
        if (this.selectedImage) {
          const formDataImage = new FormData();
          formDataImage.append('image', this.selectedImage!);
          this.userService.updateImage(formDataImage).subscribe((data: any) => {
            console.log(data)
            this.closingDialig = true
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 1000)
            // this.dialogRef.close(true);
          });
        } else {
          //this.dialogRef.close(true);
          this.closingDialig = true
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000)
        }
      },
      error: (error) => {
        console.error('Errore durante la richiesta:', error.error);
        this.textError = error.error;
      },
    });
  }
  // uploadImage(event: any): void {
  //   const selectedFile = event.target.files[0];
  //   if (!selectedFile) {
  //     console.log('Nessun file selezionato.');
  //     this.selectedImageName = null;
  //     return;
  //   }
  //   this.selectedImageName = selectedFile.name;
  //   const formData = new FormData();
  //   formData.append('image', selectedFile);
  //   this.userService.updateImage(formData).subscribe((res: any) => {});
  // }




  // TOO DO, RICORDATI CHE QUA ADESSO METTI SOLO L'IMMAGINE IN ANTEPRIMA, LA IMMAGINA è DA CAMBIARE ANCHE NELLA HOME PERCHE è PRESA DAL LOCAL STORAGE
  uploadImage(event: Event): void {
    //console.log(this.imagePreview)
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file)
    if (file) {
      this.selectedImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.userImage = reader.result as string; // Imposta l'anteprima
      };
      reader.readAsDataURL(file); // Legge il file e genera una data URL
    } else {
      this.userImage = null; // Rimuove l'anteprima se non c'è un file
    }
  }
  openDialog() {}
}
