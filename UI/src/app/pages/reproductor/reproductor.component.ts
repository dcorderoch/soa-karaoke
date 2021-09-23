import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReproductorService } from 'src/app/services/reproductor.service';
import { Observable, Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { Http, Response } from '@angular/http';
import LRC from 'lrc.js';
export interface LineLRC {
  text: string;
  time: number;
}

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {

id: any;
lyrics: any;
lines: LineLRC[] = [];
buttonText = 'play_arrow';
pastTime = 0 ;
isPlaying = false;
currentTime = '00:00';
lineA = '';
lineB = '';
lineD = '';
lineDD = '';
duration = '00:00';
audio = new Audio();
song: any;
  constructor(private http: Http,
              private activatedRoute: ActivatedRoute,
              private reproductorService: ReproductorService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.song = {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      id: 1
    };
    this.audio = new Audio('assets/songs/bohemian-rhapsody/bohemian-rhapsody.mp3');
    this.http
      .get('assets/songs/bohemian-rhapsody/bohemian-rhapsody.lrc')
      .subscribe((response: Response) => {
        this.processLyrics(response.text());
      });
    this.audio.addEventListener('timeupdate', (event) => {
      this.getCurrentLine(this.audio.currentTime);
      this.currentTime = this.reproductorService.secondsToString(this.audio.currentTime);
    });
  }


  public processLyrics(lrcText: any) {
    this.lyrics = LRC.parse(lrcText);
    this.lines = [];
  }

  public getCurrentLine(currentTime) {
    this.lines = this.lyrics.lines;
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].time - 1 < currentTime  && this.lines[i].time > this.pastTime){
        this.pastTime = this.lines[i].time ;
        if (this.lineA){
          this.lineB = this.lineA;
        }
        this.lineA = this.lines[i].text;
        let x = i + 1;
        while (!this.lines[x].text){
          x = x + 1;
        }
        this.lineD = this.lines[x].text;
        let y = x + 1;
        while (!this.lines[y].text){
          y++;
        }
        this.lineDD = this.lines[y].text;
      }
    }
  }

  public handleAudioPlayPause() {

    if (this.audio.paused) {
      this.audio.play();
      if (!this.duration){
      this.duration = this.reproductorService.secondsToString(this.audio.duration);
      }
      this.buttonText = 'pause';
    } else {
      this.audio.pause();
      this.buttonText = 'play_arrow';
    }
  }

  public changeTime(e){
    this.audio.currentTime = e.value;
    this.pastTime = 0 ;
  }

}
