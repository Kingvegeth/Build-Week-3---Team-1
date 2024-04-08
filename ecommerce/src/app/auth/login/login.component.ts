import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iLoginData } from '../../Models/ilogindata';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData: iLoginData = {
    email: 'remo@chat.it',
    password: 'password'
  };

  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  signIn() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Inserisci email e password.';
      return;
    }

    this.authSvc.login(this.loginData, this.rememberMe)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
          this.errorMessage = 'Credenziali non valide. Riprova.';
        }
      });
  }
}
