import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlCommunity } from '../api.export';

@Injectable({
  providedIn: 'root',
})
export class communityService {
  constructor(private http: HttpClient) {}

  getCommunity() {
    return this.http.post(urlCommunity + '/communitiesList',{}, httpOption);
  }

  postCommunity(body: any) {
    return this.http.post(urlCommunity + '/createCommunity', body, httpOption);
  }
}