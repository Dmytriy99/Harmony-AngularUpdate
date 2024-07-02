import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption2, urlPost, urlUser } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class postService {
  constructor(private http: HttpClient) {}

  getPost(page: number, limit: number) {
    return this.http.get(`${urlPost}?page=${page}&limit=${limit}`, httpOption2);
  }
  postLike(idpost: string) {
    return this.http.patch(`${urlPost}/${idpost}/like`, {}, httpOption2);
  }

  getPostbyId(idUser: string) {
    return this.http.get(`${urlPost}/${idUser}/post`, httpOption2);
  }

  postPost(body: any) {
    return this.http.post(urlPost, body, httpOption2);
  }
  // postPost(body: {}, idUser: number) {
  //   return this, this.http.post(`${urlUser}/${idUser}/posts`, body, httpOption);
  // }

  // getBySearch(input: string) {
  //   return this.http.get(`${urlPost}?title=${input}`, httpOption);
  // }

  // getAllPostByIndex(pageIndex: number, pageSize: number) {
  //   return this.http.get(
  //     `${urlPost}?page=${pageIndex}&per_page=${pageSize}`,
  //     httpOption
  //   );
  // }
  // getPostById(userId: number) {
  //   return this.http.get(`${urlUser}/${userId}/posts`, httpOption);
  // }
  // getheaders() {
  //   return this.http.get(`${urlPost}`, { ...httpOption, observe: 'response' });
  // }
}
