import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  pass = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {}
  register(userName, userPassword, email) {
    let user = new User();
    user.username = userName.value;
    user.password = userPassword.value;
    user.role = 'standardUser';
    user.email = email.value;
    this.authService.register(user).subscribe(
      (data) => {
        if (data.json().Message == 'Username already taken') {
          Swal.fire({
            icon: 'error',
            title: 'Nombre de usuario no disponible',
          });
        } else {
          Swal.fire({ icon: 'success', title: 'Registro exitoso' });
          this.router.navigate(['login']);
        }
      },
      (error) => {
        Swal.fire({ icon: 'error', title: 'Registro fallido' });
      }
    );
  }
}
