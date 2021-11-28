export class Dashboard {
  timesConnected: number;
  lastSong: string;
  songsCompleted: number;
  favoriteArtist: string;
  favoriteSongs: string;

  constructor() {
    this.timesConnected = 0;
    this.lastSong = "";
    this.songsCompleted = 0;
    this.favoriteArtist = "";
    this.favoriteSongs = "";
  }
}
