import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Sector } from '../../common/models/sector';
import { APIEntry } from 'src/app/common/enums/api';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Sectors service.
 *
 * ---
 *
 * Handles simple CRUD operations through the API.
 */
@Injectable({
  providedIn: 'root'
})
export class SectorApiService {

  constructor(
    private _httpClient: HttpClient
  ) {}

  get(): Observable<Sector[]> {
    return this._httpClient
      .get<Sector[]>(`${APIEntry.SECTOR_ENTRY}/get`);
  }

  /**
   * Adds a Sector (without its id) with aany level and parent.
   *
   * @param sector Sector name, Sector level and parentId if any.
   */
  add(sector: Partial<Sector>): Observable<Sector> {
    return this._httpClient
      .post<Sector>(`${APIEntry.SECTOR_ENTRY}/add`, sector, { headers: headers });
  }

  // The action is made component side only upon request success.
  edit(sector: Sector): Observable<boolean> {
    return this._httpClient
      .post<HttpResponse<string>>(`${APIEntry.SECTOR_ENTRY}/update/${sector._id}`, sector, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // The action is made component side only upon request success.
  delete(id: number): Observable<boolean> {
    return this._httpClient
      .delete<HttpResponse<string>>(`${APIEntry.SECTOR_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }
}
