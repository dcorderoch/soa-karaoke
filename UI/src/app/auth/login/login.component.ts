import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'bzq-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name = new FormControl('', [Validators.required, Validators.email]);
  pass = new FormControl('', [Validators.required]);


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.emailSignIn(this.name, this.pass);
    }
  }

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
  }

 

  showSwal(pText: string, pIcon: any) {
    Swal.fire({
      text: pText,
      icon: pIcon,
      confirmButtonText: 'Cerrar'
    });
  }

  emailSignIn(user: any, password: any) {
    if (
      this.name.hasError('required') ||
      this.name.hasError('email') ||
      this.pass.hasError('required')
    ) {
    } else {
     
    }
  }

  getErrorMessage() {
    let message;
    if (this.name.hasError('required') && this.pass.hasError('required')) {
      message = 'Por favor ingrese las credenciales';
      return message;
    } else if (this.name.hasError('required')) {
      message = 'Por favor ingrese el email';
      return message;
    } else if (this.pass.hasError('required')) {
      message = 'Por favor ingrese la contraseña';
      return message;
    } else {
      message = this.name.hasError('email') ? 'Correo eléctronico no válido' : '';
      return message;
    }
  }
}

