// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { httpOption2 } from '../api.export';
// import { Post } from 'src/app/modelli/interface';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProvaServiceService {
//   urlUser: string = 'http://localhost:3000/api/user';
//   urlPost: string = 'http://localhost:3000/api/post';
//   urlRegister: string = 'http://localhost:3000/api/register';
//   urlLogOut: string = 'http://localhost:3000/api/logout';
//   urlUserInfo: string = 'http://localhost:3000/api/user/userinfo';
//   urlLogin: string = 'http://localhost:3000/api/login';
//   urlUpdateUser: string = 'http://localhost:3000/api/user/update';
//   urlUserold: string = 'https://gorest.co.in/public/v2/users';
//   urlPostComment: string = 'http://localhost:3000/api/post/:postId/comment';
//   urlUpadateInfo: string = 'http://localhost:3000/api/user/updateDetails';
//   urlPostById: string = 'http://localhost:3000/api/post/:userId/post';
//   constructor(private http: HttpClient) {}
//   logout() {
//     return this.http.post(`${this.urlLogOut}`, {}, httpOption2);
//   }

//   postLike(idpost: string) {
//     return this.http.patch(
//       `http://localhost:3000/api/post/${idpost}/like`,
//       {},
//       httpOption2
//     );
//   }

//   getPostbyId(idUser: string) {
//     return this.http.get(
//       `http://localhost:3000/api/post/${idUser}/post`,
//       httpOption2
//     );
//   }

//   updateUserInfo(body: any) {
//     return this.http.patch(this.urlUpadateInfo, body, httpOption2);
//   }

//   getUserImage(userId: string) {
//     return this.http.get(`http://localhost:3000/api/user/${userId}/image`, {
//       responseType: 'blob',
//     });
//   }

//   postComment(body: any, postId: any) {
//     return this.http.post(
//       `http://localhost:3000/api/post/${postId}/comment`,
//       body,
//       httpOption2
//     );
//   }

//   getCommentById(idPost: any) {
//     return this.http.get(
//       `http://localhost:3000/api/post/${idPost}/comment`,
//       httpOption2
//     );
//   }

//   getPost(page: number, limit: number): Observable<any> {
//     return this.http.get(
//       `${this.urlPost}?page=${page}&limit=${limit}`,
//       httpOption2
//     );
//   }

//   provaVecchieapi() {
//     return this.http.get(this.urlUserold, httpOption2);
//   }

//   // addUser(body: any) {
//   //   return this.http.post(this.urlUser, body);
//   // }

//   getUserById(userId: any) {
//     return this.http.get(`${this.urlUser}/${userId}`, httpOption2);
//   }

//   getUser(page: number, limit: number) {
//     return this.http.get(
//       `${this.urlUser}?page=${page}&limit=${limit}`,
//       httpOption2
//     );
//   }

//   getUserBySearch(name: string) {
//     return this.http.get(`${this.urlUser}?name=${name}`, httpOption2);
//   }
//   getUserBySearchEmail(email: string) {
//     return this.http.get(`${this.urlUser}?email=${email}`, httpOption2);
//   }

//   postPost(body: any) {
//     return this.http.post(this.urlPost, body, httpOption2);
//   }

//   register(body: {}) {
//     return this.http.post(this.urlRegister, body);
//   }

//   getUserInfo() {
//     return this.http.get(this.urlUserInfo, httpOption2);
//   }

//   login(body: any) {
//     return this.http.post(this.urlLogin, body);
//   }

//   update(userData: any) {
//     return this.http.post(this.urlUpdateUser, userData, httpOption2);
//   }
// }
