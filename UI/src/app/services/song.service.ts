import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Filter } from "src/app/models/filter";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class SongService {
  api;
  constructor(private http: Http, public authService: AuthService) {
    this.api = this.authService.getAPIURL();
  }

  getSong(id) {
    return this.http.get(this.api + "songs/" + id);
  }
  getSongs() {
    return this.http.get(this.api + "songs");
  }
  getFilteredSongs(value: Filter) {
    return this.http.get(
      this.api + "songs/filter/" + value.by + "/" + value.value
    );
  }

  newSong(song) {
    return this.http.post(this.api + "songs", song);
  }
  editSong(song) {
    return this.http.put(this.api + "songs", song);
  }
  deleteSong(song) {
    return this.http.delete(
      this.api + "songs",
      new RequestOptions({ body: song })
    );
  }
  updateLastSong(user, song) {
    return this.http.put(this.api + "dashboard/lastSong/" + user, song);
  }
  updateSongsCompleted(user) {
    return this.http.put(this.api + "dashboard/songsCompleted/" + user, user);
  }
  addFavSongs(list, username) {
    return this.http.put(this.api + "dashboard/addFSong/" + username, list);
  }
  addFavArtist(list, username) {
    return this.http.put(this.api + "dashboard/addFArtist/" + username, list);
  }
  getArtistInfo(artist) {
    return this.http.get(this.api + "getinfo/" + artist);
  }
}
