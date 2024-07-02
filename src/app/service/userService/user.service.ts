import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddUser } from 'src/app/modelli/interface';
import { httpOption2, urlUser } from '../api.export';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userService {
  constructor(private http: HttpClient) {}
  updateUserInfo(body: any) {
    return this.http.patch(`${urlUser}/updateDetails`, body, httpOption2);
  }

  getUserImage(userId: string) {
    return this.http.get(`${urlUser}/${userId}/image`, {
      responseType: 'blob',
    });
  }

  getUserById(userId: any) {
    return this.http.get(`${urlUser}/${userId}`, httpOption2);
  }

  getUser(page: number, limit: number) {
    return this.http.get(`${urlUser}?page=${page}&limit=${limit}`, httpOption2);
  }

  getUserBySearch(name: string) {
    return this.http.get(`${urlUser}?name=${name}`, httpOption2);
  }
  getUserBySearchEmail(email: string) {
    return this.http.get(`${urlUser}?email=${email}`, httpOption2);
  }

  getUserInfo() {
    return this.http.get(`${urlUser}/userinfo`, httpOption2);
  }

  updateImage(body: any) {
    return this.http.patch(`${urlUser}/updatePhoto`, body, httpOption2);
  }
  // createUser(name: string, email: string, gender: string, status: string) {
  //   this.user = new AddUser(email, name, gender, status);
  // }

  // addUser(body: {}) {
  //   return this.http.post(urlUser, body, httpOption);
  // }
  // getUser() {
  //   return this.http.get(urlUser, httpOption);
  // }

  // getUserByID(idUser: Number) {
  //   return this.http.get(`${urlUser}/${idUser}`, httpOption);
  // }

  // getUserbyIndex(pageIndex: number, pageSize: number): Observable<any> {
  //   return this.http.get(
  //     `${urlUser}?page=${pageIndex}&per_page=${pageSize}`,
  //     httpOption
  //   );
  // }

  // deleteUser2(idUser: Number) {
  //   return this.http.delete(`${urlUser}/${idUser}`, httpOption);
  // }

  // getUserBySearch(input: string) {
  //   return this.http.get(`${urlUser}?name=${input}`, httpOption);
  // }
  // getUserBySearchEmail(input: string) {
  //   return this.http.get(`${urlUser}?email=${input}`, httpOption);
  // }
}
