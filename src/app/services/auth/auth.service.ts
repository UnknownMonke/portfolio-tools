import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { APIEntry } from '../../common/enums/api';
import { User, UserInfos } from 'src/app/models/user';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * User authentication service.
 *
 * Only handles login for now.
 *
 * Errors are handled by default through the interceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * Requests the server for user details and token through the API,
   * if the user exists for the credentials provided, otherwise throws an error.

   * @returns {UserInfos} object containing the user details and the token (emitted upon subscription).
   * @throws exception if the user is not found (404, through the interceptor).
   */
  login(username: string, password: string): Observable<UserInfos> {
    const body = { username: username, password: password };

    return this.httpClient
      .post<UserInfos>(`${APIEntry.LOGIN_ENTRY}/login`, body, { headers: headers });
  }

  /**
   * Persists user settings such as the selected theme.
   *
   * {observe: 'response'} returns the whole response in order to retreive status (only the body is returned by default).
   *
   * @param user the user DTO stored in session.
   * @returns {boolean} whether the requests has succeeded or not.
   * @throws exception if the user is not found (404, through the interceptor).
   */
  updateUserSettings(user: User): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<any>>(`${APIEntry.LOGIN_ENTRY}/update/${user.id}/settings`, user, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }
}
