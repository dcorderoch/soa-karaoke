import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  APIURL = "http://172.21.224.1:8888/";
  constructor(private http: Http) {}

  logIn(user) {
    return this.http.post(this.APIURL + "login", user);
  }
  register(user) {
    return this.http.post(this.APIURL + "createAUser", user);
  }
  getRole(user) {
    return this.http.get(this.APIURL + "getRoleOf/" + user);
  }
  updateRole(user) {
    return this.http.post(this.APIURL + "updateRole", user);
  }
  logOut(user) {
    return this.http.post(this.APIURL + "logout", user);
  }
  getAPIURL() {
    return this.APIURL;
  }
  getDashboard(user) {
    return this.http.get(this.APIURL + "dashboard/" + user);
  }
  updateTimesConnected(user) {
    return this.http.put(
      this.APIURL + "dashboard/timesConnected/" + user,
      user
    );
  }
}
