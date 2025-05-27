import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { communityService } from 'src/app/service/communityService/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
  standalone:false
})
export class CommunityComponent implements OnInit {
  communityForm!: FormGroup;
  constructor(private communityService: communityService, private fb:FormBuilder){
    this.communityForm = this.fb.group({
      communityName: ['']
    })
  }
  ngOnInit(): void {
    this.communityService.getCommunity().subscribe((data:any)=>{
      console.log(data)
    })
  }

  createCommunity() {
    const communityName = this.communityForm.get('communityName')?.value
    console.log(communityName)
    const request = {
      displayName: communityName
    }
    this.communityService.postCommunity(request).subscribe((data: any) => {
      console.log(data)
    });
  }
}
