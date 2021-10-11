import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SongService } from 'src/app/services/song.service';
import { Song } from 'src/app/models/song';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  song = new Song();
  id;
  infForm = new FormGroup({});
  file1;
  file2;

  constructor(
    private activatedRoute: ActivatedRoute,
    public songService: SongService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user) {
      this.router.navigate(['login']);
    } else if (user.role != 'premiumUser') {
      this.router.navigate(['songs']);
    }
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.songService.getSong(this.id).subscribe((res) => {
      this.song = res.json().result;
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmited() {
    if (!this.file1) {
      this.song.file = '';
    }
    if (!this.file2) {
      this.song.lyric = '';
    }
    Swal.fire({
      title: 'Subiendo archivos',
      text: 'Por favor espere',
      showCloseButton: false,
      showCancelButton: false,
      background: '#f1f2f3',
      imageUrl: '../../assets/loading.gif',
      width: 300,
    });
    this.songService.editSong(this.song).subscribe(
      (data) => {
        Swal.fire({ icon: 'success', title: 'Modificación exitosa' });
        this.router.navigate(['songs']);
      },
      (error) => {
        Swal.fire({ icon: 'error', title: 'Modificación fallida' });
      }
    );
  }

  getMp3(e) {
    this.file1 = e.target.files[0];
    if (this.file1) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file1);
      reader.onload = () => {
        if (reader.result) {
          this.song.file = reader.result.slice(23);
        }
      };
    }
  }
  getLyric(e) {
    this.file2 = e.target.files[0];
    if (this.file2) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file2);
      reader.onload = () => {
        if (reader.result) {
          this.song.lyric = reader.result.slice(37);
        }
      };
    }
  }
  close() {
    this.router.navigate(['songs']);
  }
}
