import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions } from '@angular/http';
import { Filter } from 'src/app/models/filter';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  APIURL = 'http://127.0.0.1:5000/';
  constructor(private http: Http) { }

  getSong(id){
    return this.http
      .get(this.APIURL + 'songs/' + id);
}
addSong(song){
  let headers = new Headers();
headers.append('encrypt', 'multipart/form-data');

let options = new RequestOptions({ headers: headers });
  console.log(song);
     return this.http
      .post(this.APIURL + 'songs', song,options);     
  }
  getSongs(){
     return this.http
      .get(this.APIURL + 'songs');     
  }
  getFilteredSongs(value: Filter){
    console.log(JSON.stringify(value));
    return this.http
      .get(this.APIURL + 'songs/filter/' + value.by +'/' + value.value);
  }
}

