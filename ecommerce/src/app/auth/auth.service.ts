import { Injectable } from '@angular/core';
import { iUser } from '../Models/iuser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { iLoginData } from '../Models/ilogindata';
import { UsersService } from '../users.service';

type AccessData = {
  accessToken:string,
  user:iUser
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  jwtHelper:JwtHelperService = new JwtHelperService()

  authSubject = new BehaviorSubject<iUser|null>(null);

  user$ = this.authSubject.asObservable()

  isLoggedIn$ = this.user$.pipe(
    map(user => !!user),
    tap(user =>  this.syncIsLoggedIn = user)
    )

    syncIsLoggedIn:boolean = false;

    constructor(
      private http:HttpClient,
      private router:Router,
      private usersService: UsersService
      ) {

        this.restoreUser()

      }

      registerUrl:string = environment.registerUrl
      loginUrl:string = environment.loginUrl

      register(newUser: Partial<iUser>): Observable<AccessData> {
        return this.http.post<AccessData>(this.registerUrl, newUser).pipe(
          tap(data => {
            this.usersService.updateUsersList();
          })
        );
      }


      login(loginData: iLoginData, rememberMe: boolean): Observable<AccessData> {
        return this.http.post<AccessData>(this.loginUrl, loginData)
          .pipe(
            tap(data => {
              this.authSubject.next(data.user);
              if (rememberMe) {
                localStorage.setItem('accessData', JSON.stringify(data));
              } else {
                sessionStorage.setItem('accessData', JSON.stringify(data));
              }
              this.autoLogout(data.accessToken);
            }),
            catchError(error => {
              throw error;
            })
          );
      }

  logout(){

    this.authSubject.next(null)
    localStorage.removeItem('accessData')
    sessionStorage.removeItem('accessData');
    this.router.navigate(['/auth/login'])

  }


  getAccessToken():string{
    const userJson = localStorage.getItem('accessData')
    if(!userJson) return '';

    const accessData:AccessData = JSON.parse(userJson)
    if(this.jwtHelper.isTokenExpired(accessData.accessToken)) return '';

    return accessData.accessToken
  }

  autoLogout(jwt:string){
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();

    setTimeout(()=>{
      this.logout()
    },expMs)
  }


  restoreUser() {

    let userJson = localStorage.getItem('accessData') || sessionStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return;

    this.authSubject.next(accessData.user);
    this.autoLogout(accessData.accessToken);
  }



  getCurrentUserId(): number | null {
    const currentUser = this.authSubject.value;
    return currentUser ? currentUser.id : null;
  }

  addFavorite(userId: number, movieId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        const favorites = Array.isArray(user.favorites) ? user.favorites : [];
        if (!favorites.includes(movieId)) {
          const updatedFavorites = [...favorites, movieId];
          const updatedUser = { ...user, favorites: updatedFavorites };
          this.http.patch<any>(url, { favorites: updatedFavorites }).subscribe(() => {
            this.authSubject.next(updatedUser);
          });
        }
      })
    );
  }
  deleteFavorite(userId: number, movieId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        const favorites = Array.isArray(user.favorites) ? user.favorites : [];
        if (favorites.includes(movieId)) {
          const updatedFavorites = favorites.filter((id: number) => id !== movieId);
          const updatedUser = { ...user, favorites: updatedFavorites };
          this.http.patch<any>(url, { favorites: updatedFavorites }).subscribe(() => {
            this.authSubject.next(updatedUser);
          });
        }
      })
    );
  }


  errors(err: any) {
    switch (err.error) {
        case "Email and Password are required":
            return new Error('Email e password obbligatorie');
            break;
        case "Email already exists":
            return new Error('Utente esistente');
            break;
        case 'Email format is invalid':
            return new Error('Email scritta male');
            break;
        case 'Cannot find user':
            return new Error('utente inesistente');
            break;
            default:
        return new Error('Errore');
            break;
    }
  }

}
