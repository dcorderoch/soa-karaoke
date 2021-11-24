import { Component, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReproductorService } from "src/app/services/reproductor.service";
import { Observable, Subscription } from "rxjs";
import { fromEvent } from "rxjs";
import { Http, Response } from "@angular/http";
import { SongService } from "src/app/services/song.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { RecognitionService } from "src/app/services/recognition.service";

import LRC from "lrc.js";
export interface LineLRC {
  text: string;
  time: number;
}

@Component({
  selector: "app-reproductor",
  templateUrl: "./reproductor.component.html",
  styleUrls: ["./reproductor.component.css"],
})
export class ReproductorComponent implements OnInit {
  POINTS_MULTIPLIER = 5;
  onSpeechStart = new EventEmitter<boolean>();
  id: any;
  lyrics: any;
  ActualLines: string[] = [];
  lines: LineLRC[] = [];
  buttonText = "play_arrow";
  pastTime = 0;
  isPlaying = false;
  currentTime = "00:00";
  lineA = "";
  lineB = "";
  lineD = "";
  lineDD = "";
  duration = "00:00";
  audio = new Audio();
  song: any = "";
  points = 0;

  constructor(
    public songService: SongService,
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private reproductorService: ReproductorService,
    private router: Router,
    private recognitionService: RecognitionService
  ) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user) {
      this.router.navigate(["login"]);
    }

    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.songService.getSong(this.id).subscribe((res) => {
      this.song = res.json().result;
      this.audio = new Audio(this.song.file);
      this.http.get(this.song.lyric).subscribe((response: Response) => {
        this.processLyrics(response.text());
      });
      this.audio.addEventListener("loadedmetadata", (event) => {
        this.duration = this.reproductorService.secondsToString(
          this.audio.duration
        );
      });
      this.audio.addEventListener("timeupdate", (event) => {
        this.getCurrentLine(this.audio.currentTime);
        this.currentTime = this.reproductorService.secondsToString(
          this.audio.currentTime
        );
      });
    });
  }

  public processLyrics(lrcText: any) {
    this.lyrics = LRC.parse(lrcText);
    this.lines = [];
  }
  public handleSpeechFound(text: string) {
    this.ActualLines.push(this.lineB);
    this.ActualLines.push(this.lineA);
    this.ActualLines.push(this.lineD);
    this.ActualLines.push(this.lineDD);
    const matches = this.recognitionService.countMatches(
      text,
      this.ActualLines
    );
    this.points += matches * this.POINTS_MULTIPLIER;
  }

  public getCurrentLine(currentTime) {
    this.lines = this.lyrics.lines;
    for (let i = 0; i < this.lines.length; i++) {
      if (
        this.lines[i].time - 1 < currentTime &&
        this.lines[i].time > this.pastTime
      ) {
        this.pastTime = this.lines[i].time;
        if (this.lineA) {
          this.lineB = this.lineA;
        }
        this.lineA = this.lines[i].text;
        let x = i + 1;
        while (!this.lines[x].text) {
          x = x + 1;
        }
        this.lineD = this.lines[x].text;
        let y = x + 1;
        while (!this.lines[y].text) {
          y++;
        }
        this.lineDD = this.lines[y].text;
      }
    }
  }

  public handleAudioPlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      if (!this.duration || this.duration == "00:00") {
        this.duration = this.reproductorService.secondsToString(
          this.audio.duration
        );
      }
      this.buttonText = "pause";
      this.onSpeechStart.emit(true);
    } else {
      this.audio.pause();
      this.buttonText = "play_arrow";
      this.onSpeechStart.emit(false);
    }
  }

  public changeTime(e) {
    this.audio.currentTime = e.value;
    this.pastTime = 0;
  }
}
