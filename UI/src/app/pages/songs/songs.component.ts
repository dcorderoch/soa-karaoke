import { Component, OnInit } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { Router } from '@angular/router';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
  songs;
  filtro;
  value;
  constructor(    private router: Router,
public songService: SongService) { }

  ngOnInit(): void {
    this.songService.getSongs().subscribe(res => {
        this.songs =  Array.of(res.json())[0].songs;
    }
    );

  }
  viewSong(id){
    console.log(id);
    let url = 'song/' + id;
    this.router.navigate([url]);

  }

  getFilter(){
    const body: Filter = {
      value: this.value,
      by: this.filtro
    };
    this.songService.getFilteredSongs(body).subscribe(res => {
        this.songs =  Array.of(res.json())[0].songs;
        console.log(this.songs);
    }
    );
  }

}
