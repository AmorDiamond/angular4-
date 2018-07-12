import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface LoginParams {
  username: string;
  password: string;
}

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post('/login', new HttpParams().set('username', data.username).set('password', data.password), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // params: new HttpParams().set('username', data.username).set('password', data.password),
    });
  }

}
