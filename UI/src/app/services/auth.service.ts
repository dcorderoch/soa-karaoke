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
      .post(this.APIURL + 'login', user);
}
 register(user){
    return this.http
      .post(this.APIURL + 'createAUser', user);
}
getRole(user){
    return this.http
      .get(this.APIURL + 'getRoleOf/' + user);
}
updateRole(user){
    return this.http
      .post(this.APIURL + 'updateRole' , user);
}
logOut(){
    return this.http
      .get(this.APIURL + 'logout');
}
getAPIURL(){
    return this.APIURL;
}
}
