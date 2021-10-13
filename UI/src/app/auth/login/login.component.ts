import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserLogin, UserToken } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'bzq-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  pass = new FormControl('', [Validators.required]);
  user = new UserLogin();
  user2 = new UserToken();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.emailSignIn(this.name, this.pass);
    }
  }

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {}

  showSwal(pText: string, pIcon: any) {
    Swal.fire({
      text: pText,
      icon: pIcon,
      confirmButtonText: 'Cerrar',
    });
  }

  emailSignIn(user: any, password: any) {
    if (
      this.name.hasError('required') ||
      this.name.hasError('email') ||
      this.pass.hasError('required')
    ) {
    } else {
      this.user.username = user.value;
      this.user.password = password.value;
      this.authService.logIn(this.user).subscribe(
        (data) => {
          this.user2 = data.json();
          localStorage.setItem('user', JSON.stringify(this.user2));
          this.router.navigate(['songs']);
        },
        (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo iniciar sesión' });
        }
      );
    }
  }
}
