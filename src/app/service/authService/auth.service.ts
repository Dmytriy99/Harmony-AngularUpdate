import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOption, urlAuth } from '../api.export';
@Injectable({
  providedIn: 'root',
})
export class AuthServiceComp {
  constructor(private http: HttpClient) {}
  logout() {
    return this.http.post(`${urlAuth}/logout`, {}, httpOption);
  }

  register(body: {}) {
    return this.http.post(`${urlAuth}/register`, body);
  }

  login(body: any) {
    return this.http.post(`${urlAuth}/login`, body);
  }
}
