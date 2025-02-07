import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceComp } from 'src/app/service/authService/auth.service';
import { SoketService } from 'src/app/service/soketService/soket.service';
import { userService } from 'src/app/service/userService/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {
  notificationCount!: number ;
  userId!: any
  userImage!: any
  imageLoading = false
  userLog!:any
  userName!: any
  notification: any

  isWindowOpen: boolean = false;

  photoGirl2: string =
  'https://media.istockphoto.com/id/1222666476/it/vettoriale/donna-divertente-che-more-i-capelli-a-casa-vector.jpg?s=612x612&w=0&k=20&c=IrBrTs24crgvdIuWGiLGqYDchzvIZeuJEavVlHIhqdc=';
photoMan2: string =
  'https://media.istockphoto.com/id/1349231567/it/vettoriale/personaggio-in-stile-anime-del-giovane-uomo-anime-ragazzo-vettoriale.jpg?s=612x612&w=0&k=20&c=og5UTl4H2bTTuqLDA9cHoYikk9pzYYgHxR1ZhWaopS4=';


  constructor(private route: Router, private authService: AuthServiceComp, private userService: userService,private soketService: SoketService,private router: Router,) {}
  ngOnInit(): void {
    this.userId = localStorage.getItem('user')
    this.imageLoading = true
    this.getUserLogInfo()

    this.userService.refreshUser$.subscribe(refresh => {
      this.imageLoading = true
      if (refresh) {
        this.getUserLogInfo();
      }
    });
    this.setupSocketConnection()
  }
  setupSocketConnection() {
    const socket = this.soketService.getSocket();
    socket.on('newFriendRequestReceived', (friendRequests: any) => {
        console.log('Nuovo Like Ricevuto:', friendRequests);
      }) 
  }

  toggleWindow() {
    this.isWindowOpen = !this.isWindowOpen;
    this.notificationCount = 0
    this.userService.resetNotificationCount().subscribe((data: any) => {})
  }
  getUserLogInfo() {
    this.userService.getUserById(this.userId).subscribe((data: any) => {
      console.log(data)
      this.userLog = data
      this.userImage = data.imageId
      this.userName = data.name
      this.notification = data.notification
      this.notificationCount = data.notificationCount
      console.log(this.notification)
      if (this.userImage) {
        this.getUserImage(this.userImage)
      } else {
        this.userImage =
          data.gender === 'female' ? this.photoGirl2 : this.photoMan2;
          this.imageLoading = false
      }
    })
  }


  getUserImage(userImageId: string) {
    // this.imageLoading = true
    this.userService.getUserImage(userImageId).subscribe({
      next: (response: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          this.userImage = reader.result as string;
          this.imageLoading = false
        };
      },
      error: (error) => {
        console.error('errore', error);
      },
    });
  }
  logOut() {
    this.authService.logout().subscribe((data: any) => {});
    localStorage.removeItem('isLog');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.route.navigate(['login']);
  }

  loadNotifications(){
    console.log(this.userLog)
  }
  acceptFriendRequest(userId: any) {
    this.userService.acceptFriendRequest(userId).subscribe((data: any) => {

    })
    }
    openUserProfile(userId:any){
      this.router.navigate([`users/${userId}`])
    }
}
