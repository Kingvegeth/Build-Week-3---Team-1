import { Component } from '@angular/core';
import { iUser } from '../../Models/iuser';
import { ProductsService } from '../../products.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../users.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user: iUser | undefined;

  constructor(private authSvc: AuthService, private usersSvc: UsersService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    // Utilizza l'ID dell'utente autenticato per recuperare i dettagli dell'utente
    const userId = this.authSvc.getCurrentUserId();
    if (userId !== null) {
      this.usersSvc.getUserById(userId).subscribe(user => this.user = user);
    }
  }
  saveUser(): void {
    if (this.user) {
      this.usersSvc.updateUser(this.user).subscribe(() => {
       console.log('Modifiche al profilo eseguite con successo');
      });
    }
  }

}
