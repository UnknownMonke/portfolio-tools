import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Geography } from '../../models/geography';
import { APIEntry } from '../../common/enums/api';


@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  headers: any = new HttpHeaders({
    'Content-Type':  'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {}

  // Soit pas de typage pour le get, on retourne le raw, soit typage.
  // Par défaut la réponse est seulement le body JSON
  getGeography(): Observable<Geography[]> {
    return this.httpClient.get<Geography[]>(`${APIEntry.GEOGRAPHY_ENTRY}/get`)
      .pipe(
        catchError(this.handleError<Geography[]>())
      );
  }

  addGeography(name: string): Observable<Geography> {
    const body = {
      name: name
    };
    return this.httpClient
      .post<Geography>(`${APIEntry.GEOGRAPHY_ENTRY}/add`, JSON.stringify(body), { headers: this.headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  // Retourne le statut de la requête, si ok l'update se fait via la valeur du front
  editGeography(geography: Geography): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Geography>>(`${APIEntry.GEOGRAPHY_ENTRY}/update/${geography._id}`, geography, { headers: this.headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Retourne le statut de la requête, si ok l'update se fait via la valeur du front
  deleteGeography(geography: Geography): Observable<number> {
    return this.httpClient
      .delete<HttpResponse<Geography>>(`${APIEntry.GEOGRAPHY_ENTRY}/delete/${geography._id}`, { headers: this.headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(response?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: Retourne une erreur avec un message User-friendly
      //this.log(`Failed: ${error.message}`);

      // Transmission non bloquante de la réponse
      return of(response as T);
    };
  }
}
