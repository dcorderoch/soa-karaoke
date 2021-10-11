import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  APIURL = 'http://172.19.232.88:8888/';
  constructor(private http: Http) {}

  logIn(user) {
    return this.http.post(this.APIURL + 'login', user);
  }
  register(user) {
    return this.http.post(this.APIURL + 'createAUser', user);
  }
  getRole(user) {
    return this.http.get(this.APIURL + 'getRoleOf/' + user);
  }
  updateRole(user) {
    return this.http.post(this.APIURL + 'updateRole', user);
  }
  logOut(user) {
    return this.http.post(this.APIURL + 'logout', user);
  }
  getAPIURL() {
    return this.APIURL;
  }
}
