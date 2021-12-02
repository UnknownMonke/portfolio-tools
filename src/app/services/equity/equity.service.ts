import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Equity } from '../../models/equity';
import { APIEntry } from '../../common/enums/api';


@Injectable({
  providedIn: 'root'
})
export class EquityService {

  headers: any = new HttpHeaders({
    'Content-Type':  'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {}

  // Récupère tous les actifs en base.
  getEquities(): Observable<Equity[]> {
    return this.httpClient.get<Equity[]>(`${APIEntry.EQUITY_ENTRY}/get`)
      .pipe(
        catchError(this.handleError<Equity[]>())
      );
  }

  getEquity(id: string): Observable<Equity> {
    return this.httpClient.get<Equity>(`${APIEntry.EQUITY_ENTRY}/get/${id}`)
      .pipe(
        catchError(this.handleError<Equity>())
      );
  }

  // Ajoute une liste d'actif, avec ou sans exposure, et retourne seulement le statut car l'id est générée côté client
  addEquities(equities: Equity[]): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/add`, equities, { headers: this.headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

   // Edite une liste d'actif en éditant tout sauf l'exposure (non présente dans les données courtier), et retourne seulement le statut car l'id est générée côté client
  editEquities(equities: Equity[]): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/update`, this.mapEquityWithoutExposure(equities), { headers: this.headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Edite un actif unique
  editEquity(equity: Equity): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Equity>>(`${APIEntry.EQUITY_ENTRY}/update/${equity._id}`, JSON.stringify(equity), { headers: this.headers, observe: 'response' })
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

  // Mapping DTO -> Entité en supprimant les exposure
  private mapEquityWithoutExposure(equities: Equity[]): any[] {

    /*equities.forEach(equity => {
      if(equity.geography.length > 0) {

        equity.geography.forEach((geoExposure: any) => {
          const geoId = geoExposure.geography._id;
          geoExposure.remove('geography');
          geoExposure.geographyId = geoId;
        });
      }
      if(equity.sectors.length > 0) {

        equity.sectors.forEach((secExposure: any) => {
          const secId = secExposure.sector._id;
          secExposure.remove('sector');
          secExposure.sectorId = secId;
        });
      }
    });*/
    equities.forEach(equity => {
      equity.geography = [];
      equity.sectors = [];
    });
    return equities;
  }
}
