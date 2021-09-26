import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  infForm = new FormGroup({});
  name;
  artista;
  album;
  id;
  mp3;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
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
      ])
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmited(){
    console.log(this.infForm.value);
  }
  getMp3(event){
  console.log(this.mp3);

  }

}
