import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Geography } from '../../models/geography';
import { APIEntry } from '../../common/enums/api';


const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  constructor(
    private httpClient: HttpClient
  ) {}

  // Soit pas de typage pour le get, on retourne le raw, soit typage.
  // Par défaut la réponse est seulement le body JSON
  getGeographies(): Observable<Geography[]> {
    return this.httpClient.get<Geography[]>(`${APIEntry.GEOGRAPHY_ENTRY}/get`)
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  // Le check de la présence du paramètre avec le bon type est automatique et le code ne compilera pas si ce n'est pas le cas
  addGeography(name: string): Observable<Geography> {
    const body = { name: name };
    return this.httpClient
      .post<Geography>(`${APIEntry.GEOGRAPHY_ENTRY}/add`, JSON.stringify(body), { headers: headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  // La réponse dépend de l'implémentation du contrôleur, ici on ne retourne que le statut qui est géré par l'intercepteur,
  // donc soit erreur, soit retour ok, si ok l'update se fait via la valeur du front
  editGeography(geography: Geography): Observable<number> {
    return this.httpClient
      .post<HttpResponse<any>>(`${APIEntry.GEOGRAPHY_ENTRY}/update/${geography._id}`, geography, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Retourne le statut de la requête, si ok l'update se fait via la valeur du front
  deleteGeography(id: string): Observable<number> {
    return this.httpClient
      .delete<HttpResponse<Geography>>(`${APIEntry.GEOGRAPHY_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(response?: T) {
    return (error: any): Observable<T> => {

      // Retourne une erreur avec un message User-friendly via le handler
      throwError(() => new Error('Error while retreiving geographies')).subscribe();

      // Transmission non bloquante de la réponse
      return of(response as T);
    };
  }
}
