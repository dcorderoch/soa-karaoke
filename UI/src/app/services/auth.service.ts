import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  APIURL = 'http://127.0.0.1:5000/';
  constructor(private http: Http) { }

  logIn(user){
    return this.http
      .get(this.APIURL + 'songs/');
}
 register(user){
    return this.http
      .post(this.APIURL + 'register', user);
}
}
