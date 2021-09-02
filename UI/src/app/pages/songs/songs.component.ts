import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
  songs = [ {
    title: 'Love of my life',
    artist: 'Queen',
    id: 1
  },
  {
    title: 'Aerials',
    artist: 'System of a down',
    id: 2
  },
  {
    title: 'Scorpions',
    artist: 'Wind of change',
    id: 3
  },
  {
    title: 'Bed of roses',
    artist: 'Bon Jovi',
    id: 4
  }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
