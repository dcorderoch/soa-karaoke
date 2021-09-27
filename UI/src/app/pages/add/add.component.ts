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
      Swal.fire({
       title: 'Subiendo archivos',
       text: 'Por favor espere',
       showCloseButton: false,
       showCancelButton: false,
       background: '#f1f2f3',
       imageUrl: '../../assets/loading.gif',
       width:300
     });
    this.songService.newSong(this.song).subscribe(data => {
      Swal.fire(  {icon: 'success',
 title:'Registro exitoso'});
    },
    error => {
      Swal.fire( { icon: 'error',
 title:'Registro fallido'});
      console.log(error);
      });
  }
  file(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if(reader.result){
      this.song.file = reader.result.slice(23);
    }
    };
  }
  file2(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if(reader.result){
        this.song.lyric = reader.result.slice(37);
        }
    };
  }


}
