import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

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

  constructor() { }

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
    console.log(this.infForm.value);
  }

}
