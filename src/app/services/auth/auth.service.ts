import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIEntry } from '../../common/enums/api';


const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/** Authentication service for users */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {}

  login(username: string, password: string): Observable<any> {
    const body = { username: username, password: password };
    return this.httpClient
      .post<HttpResponse<any>>(`${APIEntry.LOGIN_ENTRY}/login`, JSON.stringify(body), { headers: headers })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(response?: T) {
    return (error: any): Observable<T> => {

      // Retourne une erreur avec un message User-friendly via le handler
      throwError(() => new Error('Error while retreiving user')).subscribe();

      // Transmission non bloquante de la réponse
      return of(response as T);
    };
  }
}
