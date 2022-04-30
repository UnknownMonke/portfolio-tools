import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Equity } from '../model/equity';
import { APIEntry } from '../../common/enums/api';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});

/**
 * Equities service.
 *
 * ---
 *
 * Handles CRUD operations through the API.
 */
@Injectable({
  providedIn: 'root'
})
export class EquityService {

  constructor(
    private httpClient: HttpClient
  ) {}

  // Récupère tous les actifs en base.
  getEquities(): Observable<Equity[]> {
    return this.httpClient.get<Equity[]>(`${APIEntry.EQUITY_ENTRY}/get`);
  }

  getEquity(id: string): Observable<Equity> {
    return this.httpClient.get<Equity>(`${APIEntry.EQUITY_ENTRY}/get/${id}`);
  }

  // using post to delete multiple
  deleteEquities(): Observable<boolean> {
    return this.httpClient
      .delete<HttpResponse<any>>(`${APIEntry.EQUITY_ENTRY}/delete/all`, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // Ajoute une liste d'actif, avec ou sans exposure, et retourne seulement le statut car l'id est générée côté client.
  addEquities(equities: Equity[]): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/add`, equities, { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // Edite une liste d'actif en éditant tout sauf l'exposure (non présente dans les données courtier), et retourne seulement le statut car l'id est générée côté client.
  editEquities(equities: Equity[]): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<Equity[]>>(`${APIEntry.EQUITY_ENTRY}/update`, this.mapEquityWithoutExposure(equities), { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
  }

  // Edite un actif unique.
  editEquity(equity: Equity): Observable<boolean> {
    return this.httpClient
      .post<HttpResponse<Equity>>(`${APIEntry.EQUITY_ENTRY}/update/${equity._id}`, JSON.stringify(equity), { headers: headers, observe: 'response' })
      .pipe(
        map(response => response.status === 200)
      );
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
