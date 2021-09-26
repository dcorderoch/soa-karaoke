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
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }
  register(userName, userPassword){
    let user = new User();
    user.userName = userName.value;
    user.password =userPassword.value;
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
