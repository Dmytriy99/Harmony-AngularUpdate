import { Component, Inject, OnInit } from '@angular/core';
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
constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,private communityService: communityService,private dialogRef: MatDialogRef<CommunityModalComponent>) {
    if(dialogData) 
      this.communityList = dialogData.community;
  }
  ngOnInit(): void {
    console.log(this.communityList)
  }
}
