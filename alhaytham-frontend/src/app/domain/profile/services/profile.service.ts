import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserInterface } from '../../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl: string = `${environment.API_URL}/v1/profile`;

  constructor(private httpClient: HttpClient) { }

  /**
   * Obtain the authenticated user's profile
   */
  getProfile(): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(this.apiUrl);
  }

  /**
   * Update user name/email
   */
  updateProfile(data: { name?: string; email?: string }): Observable<UserInterface> {
    return this.httpClient.patch<UserInterface>(this.apiUrl, data);
  }

  /**
   * Change user password
   */
  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/password`, data);
  }

  /**
   * Delete the current user's account
   */
  deleteProfile(): Observable<void> {
    return this.httpClient.delete<void>(this.apiUrl);
  }

  /**
   * Confirm the user password
   */
  confirmPassword(currentPassword: string): Observable<{ validPassword: boolean }> {
    return this.httpClient.post<{ validPassword: boolean }>(`${this.apiUrl}/confirm-password`, { currentPassword });
  }
}
