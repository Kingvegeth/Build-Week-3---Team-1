import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iUser } from './Models/iuser';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = environment.usersUrl;
  private usersCache: iUser[] = [];
  usersArray: iUser[]=[]

  private usersSubject = new BehaviorSubject<iUser[]>([]);

  public users$ = this.usersSubject.asObservable()

  constructor(private http:HttpClient){
    this.getAll().subscribe(data => {
      this.usersSubject.next(data)
      this.usersArray = data;
    })
  }



  getAll(){
    return this.http.get<iUser[]>(this.usersUrl)
  }

  getUserById(id: number): Observable<iUser> {
    const url = `${this.usersUrl}`;
    return this.http.get<iUser>(url);
  }

  updateUsersList(): void {
    this.getAll().subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  updateUser(user: iUser): Observable<any> {
    const url = `${this.usersUrl}`;
    return this.http.put(url, user).pipe(
      tap(() => {
        const index = this.usersCache.findIndex(p => p.id === user.id);
        if (index !== -1) {
          this.usersCache[index] = user;
          this.usersSubject.next(this.usersCache);
        }
      })
    );
  }

}
