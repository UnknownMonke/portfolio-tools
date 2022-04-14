import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sector } from '../../models/sector';
import { APIEntry } from '../../common/enums/api';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Sectors service.
 *
 * Handles simple CRUD operations through the API.
 */
@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getSectors(): Observable<Sector[]> {
    return this.httpClient
      .get<Sector[]>(`${APIEntry.SECTOR_ENTRY}/get`);
  }

  /**
   * Adds a Sector (without its id) with aany level and parent.
   *
   * @param sector Sector name, Sector level and parentId if any.
   */
  addSector(sector: any): Observable<Sector> {
    return this.httpClient
      .post<Sector>(`${APIEntry.SECTOR_ENTRY}/add`, sector, { headers: headers });
  }

  // The action is made component side only upon request success.
  editSector(sector: Sector): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<any>>(`${APIEntry.SECTOR_ENTRY}/update/${sector._id}`, sector, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // The action is made component side only upon request success.
  deleteSector(id: number): Observable<boolean> {
    return this.httpClient
      .delete<HttpResponse<any>>(`${APIEntry.SECTOR_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }
}
