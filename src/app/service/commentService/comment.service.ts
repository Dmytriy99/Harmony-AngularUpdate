import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption2, urlPost } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  postComment(body: any, postId: any) {
    return this.http.post(`${urlPost}/${postId}/comment`, body, httpOption2);
  }

  getCommentById(idPost: any) {
    return this.http.get(`${urlPost}/${idPost}/comment`, httpOption2);
  }

  // getComment(post_id: number) {
  //   return this.http.get(`${urlPost}/${post_id}/comments`, httpOption);
  // }

  // postComment(body: {}, postID: number) {
  //   return this.http.post(`${urlPost}/${postID}/comments`, body, httpOption);
  // }
}
