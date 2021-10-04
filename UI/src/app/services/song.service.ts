import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
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
  getSongs(){
     return this.http
      .get(this.APIURL + 'songs');     
  }
  getFilteredSongs(value: Filter){
    return this.http
      .get(this.APIURL + 'songs/filter/' + value.by +'/' + value.value);
  }

  newSong(song){
    return this.http.post(this.APIURL + 'songs', song);
  }
  editSong(song){
    return this.http.put(this.APIURL + 'songs', song);
  }

}

