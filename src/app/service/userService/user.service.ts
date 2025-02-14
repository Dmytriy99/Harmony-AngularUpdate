import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlUser } from '../api.export';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userService {
  constructor(private http: HttpClient) {}

  private refreshUserSubject = new BehaviorSubject<boolean>(false);
  refreshUser$ = this.refreshUserSubject.asObservable();

  triggerUserRefresh() {
    this.refreshUserSubject.next(true);
  }


  updateUserInfo(body: any) {
    return this.http.patch(`${urlUser}/updateDetails`, body, httpOption);
  }

  getUserImage(imageID: string) {
    return this.http.get(`${urlUser}/${imageID}/image`, {
      responseType: 'blob',
    });
  }

  getUserById(userId: any) {
    return this.http.get(`${urlUser}/${userId}`, httpOption);
  }

  getUser(page: number, limit: number) {
    return this.http.get(`${urlUser}?page=${page}&limit=${limit}`, httpOption);
  }

  getUserBySearch(name: string) {
    return this.http.get(`${urlUser}?name=${name}`, httpOption);
  }
  getUserBySearchEmail(email: string) {
    return this.http.get(`${urlUser}?email=${email}`, httpOption);
  }

  getUserInfo() {
    return this.http.get(`${urlUser}/userinfo`, httpOption);
  }

  updateImage(body: any) {
    return this.http.patch(`${urlUser}/updatePhoto`, body, httpOption);
  }

  sendFriendRequest2(userId: any) {
    return this.http.post(`${urlUser}/send-friend-request`,  {userId} , httpOption);
  }

  acceptFriendRequest(userId: string) {
    return this.http.post(`${urlUser}/accept-friend-request`, { userId }, httpOption);
  }

  rejectFriendRequest(userId: string) {
    return this.http.post(`${urlUser}/reject-friend-request`, { userId }, httpOption);
  }

  removeFriend(userId: string) {
    return this.http.post(`${urlUser}/remove-friend`, { userId }, httpOption);
  }

  getFriendsList(usersIds:any) {
    return this.http.post(`${urlUser}/friends`,usersIds, httpOption);
  }

  resetNotificationCount() {
    return this.http.post(`${urlUser}/reset-notifications`,{}, httpOption);
  }
}
