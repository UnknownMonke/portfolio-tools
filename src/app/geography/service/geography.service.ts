import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Geography } from '../model/geography';
import { APIEntry } from '../../common/enums/api';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Geographies service.
 *
 * ---
 *
 * Handles simple CRUD operations through the API.
 */

// inject it only when asked for
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
  get(): Observable<Geography[]> {
    return this.httpClient
      .get<Geography[]>(`${APIEntry.GEOGRAPHY_ENTRY}/get`);
  }

  add(name: string): Observable<Geography> {
    const body = { name: name }; // Obvious variable types do not need to be declared explicitly.

    return this.httpClient
      .post<Geography>(`${APIEntry.GEOGRAPHY_ENTRY}/add`, body, { headers: headers });
  }

  // The action is made component side only upon request success.
  edit(geography: Geography): Observable<boolean> {
    // Returns the response with a string body that may contains an error message upon failure (only a hint : if wrong response, the  code will still compile).
    return this.httpClient
      .post<HttpResponse<string>>(`${APIEntry.GEOGRAPHY_ENTRY}/update/${geography._id}`, geography, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // The action is made component side only upon request success.
  delete(id: number): Observable<boolean> {
    return this.httpClient
      .delete<HttpResponse<string>>(`${APIEntry.GEOGRAPHY_ENTRY}/delete/${id}`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }
}
