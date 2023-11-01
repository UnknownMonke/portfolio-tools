import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIEntry } from '../../common/enums/api';
import { Equity } from '../../common/models/equity';
import { Geography } from 'src/app/common/models/geography';

// Common headers are defined in a constant.
const headers: any = new HttpHeaders({
  'Content-Type':  'application/json',
});


@Injectable({
  providedIn: 'root'
})
export class RepartitionService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getRepartition(equityId: number): Observable<void> {
    return this.httpClient.get<Equity[]>(`${APIEntry.EQUITY_ENTRY}/get/${equityId}`)
      .pipe(
        map( (data: Geography[]) => {
          //this.geoRepartitionSubject.next(data.map( geography => ({ geography, exposure: 0}) ))
          this.geoRepartitionSubject.next(
            data.map( geography => ( { geography, exposure: 0 } ))
          );
        })
      );
  }
}
