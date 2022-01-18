import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sector } from '../../models/sector';
import { APIEntry } from '../../common/enums/api';


const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

@Injectable({
  providedIn: 'root'
})
export class SectorService {

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
      name: name,
      level: 0,
      parentId: -1
    };
    return this.httpClient
      .post<Sector>(`${APIEntry.SECTOR_ENTRY}/add`, JSON.stringify(body), { headers: headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  addSubSector(sector: Sector, name: string): Observable<Sector> {
    const body = {
      name: name,
      level: 1,
      parentId: sector._id
    };
    return this.httpClient
      .post<Sector>(`${APIEntry.SECTOR_ENTRY}/add`, JSON.stringify(body), { headers: headers })
      .pipe(
        catchError(this.handleError<any>())
      );
  }

  editSector(sector: Sector): Observable<number> {
    return this.httpClient
      .post<HttpResponse<Sector>>(`${APIEntry.SECTOR_ENTRY}/update/${sector._id}`, sector, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status),
        catchError(this.handleError<any>())
      );
  }

  deleteSector(id: number): Observable<number> {
    return this.httpClient
      .delete<HttpResponse<Sector>>(`${APIEntry.SECTOR_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
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
