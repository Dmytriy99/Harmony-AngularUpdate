import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlUser } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class userService {
  constructor(private http: HttpClient) {}
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
}
