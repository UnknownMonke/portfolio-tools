import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Equity } from '../../models/equity';
import { APIEntry } from '../../common/enums/api';


const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/** Service CRUD pour les équités. */
@Injectable({
  providedIn: 'root'
})
export class EquityService {

  constructor(
    private httpClient: HttpClient
  ) {}

  // Récupère tous les actifs en base.
  getEquities(): Observable<Equity[]> {
    return this.httpClient.get<Equity[]>(`${APIEntry.EQUITY_ENTRY}/get`)
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  getEquity(id: string): Observable<Equity> {
    return this.httpClient.get<Equity>(`${APIEntry.EQUITY_ENTRY}/get/${id}`)
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  // Ajoute une liste d'actif, avec ou sans exposure, et retourne seulement le statut car l'id est générée côté client.
  addEquities(equities: Equity[]): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/add`, equities, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Edite une liste d'actif en éditant tout sauf l'exposure (non présente dans les données courtier), et retourne seulement le statut car l'id est générée côté client.
  editEquities(equities: Equity[]): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/update`, this.mapEquityWithoutExposure(equities), { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Edite un actif unique.
  editEquity(equity: Equity): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity>>(`${APIEntry.EQUITY_ENTRY}/update/${equity._id}`, JSON.stringify(equity), { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(response?: T) {
    return (error: any): Observable<T> => {

      // Retourne une erreur avec un message User-friendly via le handler.
      throwError(() => new Error('Error while retreiving equities')).subscribe();

      // Transmission non bloquante de la réponse.
      return of(response as T);
    };
  }

  // Mapping DTO -> Entité en supprimant les exposure.
  private mapEquityWithoutExposure(equities: any[]): any[] {
    equities.forEach(equity => {
      delete equity.geography;
      delete equity.sectors;
    });
    return equities;
  }
}
