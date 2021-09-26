import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2'
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  infForm = new FormGroup({});
  name;
  artista;
  album;
  mp3;
  lyric;
  song = new Song();

  constructor(public songService: SongService) { }

  ngOnInit(): void {
    this.infForm = new FormGroup({
      name: new FormControl(this.name, [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      artista: new FormControl(this.artista, [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      album: new FormControl(this.album, [
        Validators.required,
        this.noWhitespaceValidator
      ]),
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmited(){
    this.song.name = this.infForm.value.name;
    this.song.album = this.infForm.value.album;
    this.song.artist = this.infForm.value.artista;
    this.songService.addSong(this.song);
  }
  file(e){
    console.log(e.target);
    if(e.target.files && e.target.files[0]){
        this.song.file = JSON.stringify(e.target.files[0]);
      }
  }
  file2(e){
    console.log(e.target);
    if(e.target.files && e.target.files[0]){
        this.song.lyric = JSON.stringify(e.target.files[0]);
      }
  }


}
