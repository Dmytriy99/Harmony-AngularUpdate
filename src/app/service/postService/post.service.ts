import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlPost } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class postService {
  constructor(private http: HttpClient) {}

  getPost(page: number, limit: number) {
    return this.http.get(`${urlPost}?page=${page}&limit=${limit}`, httpOption);
  }
  postLike(idpost: string) {
    return this.http.patch(`${urlPost}/${idpost}/like`, {}, httpOption);
  }

  getPostbyId(idUser: string) {
    return this.http.get(`${urlPost}/${idUser}/post`, httpOption);
  }


  postPost(body: any) {
    return this.http.post(urlPost, body, httpOption);
  }
  getPostBySearch(body: any) {
    return this.http.get(`${urlPost}?title=${body}`, httpOption);
  }

  delatePost(postId: string) {
    return this.http.delete(`${urlPost}/${postId}`, httpOption);
  }
  
  postPhotoPost(postId: string, image: any) {
    return this.http.post(`${urlPost}/${postId}/image`,image, httpOption);
  }

  getPostImage(imageId: string, postId: any) {
    return this.http.get(`${urlPost}/${postId}/image/${imageId}`, {
      responseType: 'blob',
    });
  }
  //router.get("/:postId/image/:imageId", postController.getPostImage);
}
