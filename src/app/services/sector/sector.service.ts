import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sector } from '../../models/sector';
import { APIEntry } from '../../common/enums/api';


@Injectable({
  providedIn: 'root'
})
export class SectorService {

  headers: any = new HttpHeaders({
    'Content-Type':  'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {}

  getSectors(): Observable<Sector[]> {
    return this.httpClient.get<Sector[]>(`${APIEntry.SECTOR_ENTRY}/get`)
      .pipe(
        catchError(this.handleError<Sector[]>())
      );
  }

  // Ajout d'un secteur principal uniquement
  addSector(name: string): Observable<Sector> {
    const body = {
      name: name
    };
    return this.httpClient
      .post<Sector>(`${APIEntry.SECTOR_ENTRY}/add`, JSON.stringify(body), { headers: this.headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  // Le secteur principal est passé à chaque fois, y compris pour l'ajout ou suppression d'un sous-secteur
  editSector(Sector: Sector): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Sector>>(`${APIEntry.SECTOR_ENTRY}/update/${Sector._id}`, Sector, { headers: this.headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  // Suppression d'un secteur principal uniquement
  deleteSector(id: string): Observable<number> {
    return this.httpClient
      .delete<HttpResponse<Sector>>(`${APIEntry.SECTOR_ENTRY}/delete/${id}`, { headers: this.headers, observe: 'response' })
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
