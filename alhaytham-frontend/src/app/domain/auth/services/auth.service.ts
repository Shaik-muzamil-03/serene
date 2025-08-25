import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = `${environment.API_URL}/v1/auth`;
  public currentUser: UserInterface | null = null;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/register`, { name, email, password }, { withCredentials: true });
  }

  recoverPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recover-password`, null, {
      params: new HttpParams().set('email', email),
    });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/reset-password`, null, {
      params: new HttpParams()
        .set('token', token)
        .set('newPassword', newPassword),
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getCurrentUser(): Observable<UserInterface> {
    const userFromSessionStorage = this.getUserItemFromSession();
    if (userFromSessionStorage) {
      const parseUserFromSessionStorage = JSON.parse(userFromSessionStorage)
      this.currentUser = parseUserFromSessionStorage;

      return of(parseUserFromSessionStorage);
    }

    return this.httpClient.get<any>(`${this.apiUrl}/user-details`, { withCredentials: true }).pipe(
      map(response => {
        if (!response.loggedIn) {
          throw new Error('User not authenticated');
        }

        this.currentUser = {
          id: response.id,
          name: response.name,
          email: response.email
        };

        this.setUserItemFromSession()
        return this.currentUser;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        this.removeUserItemFromSession()
        return true;
      }),
      catchError(() => of(false))
    );
  }

  getUserItemFromSession(): string | null {
    return sessionStorage.getItem('currentUser');
  }

  setUserItemFromSession(): void {
    sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  removeUserItemFromSession(): void {
    sessionStorage.removeItem('currentUser');
  }
}
