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
  getPostBySearch(body: any) {
    return this.http.get(`${urlPost}?title=${body}`, httpOption2);
  }

  delatePost(postId: string) {
    return this.http.delete(`${urlPost}/${postId}`, httpOption2);
  }
}
