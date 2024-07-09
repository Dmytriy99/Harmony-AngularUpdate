import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlPost } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  postComment(body: any, postId: any) {
    return this.http.post(`${urlPost}/${postId}/comment`, body, httpOption);
  }

  getCommentById(idPost: any) {
    return this.http.get(`${urlPost}/${idPost}/comment`, httpOption);
  }
}
