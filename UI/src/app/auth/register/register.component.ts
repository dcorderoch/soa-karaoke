import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
name = new FormControl('', [Validators.required]);
  pass = new FormControl('', [
    Validators.required
  ]);
  email = new FormControl('', [
    Validators.required, Validators.email
  ]);
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }
  register(userName, userPassword, email){
    let user = new User();
    user.username = userName.value;
    user.password = userPassword.value;
    user.type = 'standardUser';
    user.email = email.value;
    this.authService.register(user).subscribe(data => {
      Swal.fire(  {icon: 'success',
 title:'Registro exitoso'});
    },
    error => {
      Swal.fire( { icon: 'error',
 title:'Registro fallido'});
      console.log(error);
      });
  }
}
