import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { communityService } from 'src/app/service/communityService/community.service';

@Component({
  selector: 'app-community-modal',
  templateUrl: './community-modal.component.html',
  styleUrl: './community-modal.component.css',
  standalone: false
})
export class CommunityModalComponent implements OnInit {
  communityList: any[] = [];
  formCommunity!: FormGroup
  communityInputName: string = '';
constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,private communityService: communityService,private dialogRef: MatDialogRef<CommunityModalComponent>,
            fb:FormBuilder) {   

    this.formCommunity = fb.group({
      communityName: ['']
    })
    if(dialogData) 
      this.communityList = dialogData.community;
  }
  ngOnInit(): void {
    this.formCommunity.valueChanges.subscribe(data => {
      this.communityInputName = data.communityName
    })
  }
}
