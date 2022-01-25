import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIEntry } from '../../common/enums/api';
import { User } from 'src/app/models/user';

const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Service d'authentification utilisateur.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * Vérifie que le user existe, et le renvoie si trouvé.
   * @param username
   * @param password
   * @returns objet qui contient notamment le token
   */
  login(username: string, password: string): Observable<User> {
    const body = { username: username, password: password };
    return this.httpClient
      .post<User>(`${APIEntry.LOGIN_ENTRY}/login`, JSON.stringify(body), { headers: headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(response?: T) {
    return (error: any): Observable<T> => {
      //TODO gérer les status d'erreur (404...)
      // Retourne une erreur avec un message User-friendly via le handler.
      throwError(() => new Error('Error while retreiving user')).subscribe();

      // Transmission non bloquante de la réponse.
      return of(response as T);
    };
  }
}
