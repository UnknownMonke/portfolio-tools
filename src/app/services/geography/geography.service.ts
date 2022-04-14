import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Geography } from '../../models/geography';
import { APIEntry } from '../../common/enums/api';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Geographies service.
 *
 * Handles simple CRUD operations through the API.
 */
@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * The request can by type checked when a specific object is expected to return.
   *
   * Errors (status != 200) are caught beforehand by the Interceptor.
   *
   * By default only the JSON body of the response is returned.
   */
  getGeographies(): Observable<Geography[]> {
    return this.httpClient
      .get<Geography[]>(`${APIEntry.GEOGRAPHY_ENTRY}/get`);
  }

  addGeography(name: string): Observable<Geography> {
    const body = { name: name };

    return this.httpClient
      .post<Geography>(`${APIEntry.GEOGRAPHY_ENTRY}/add`, body, { headers: headers });
  }

  // The action is made component side only upon request success.
  editGeography(geography: Geography): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<any>>(`${APIEntry.GEOGRAPHY_ENTRY}/update/${geography._id}`, geography, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // The action is made component side only upon request success.
  deleteGeography(id: number): Observable<boolean> {
    return this.httpClient
      .delete<HttpResponse<Geography>>(`${APIEntry.GEOGRAPHY_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }
}
