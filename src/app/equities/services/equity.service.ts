import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, map, of, switchMap, take, tap } from 'rxjs';
import { Equity } from 'src/app/common/models/equity';
import { Geography, GeographyExposure } from 'src/app/common/models/geography';
import { GeographyService } from 'src/app/edition/services/geography.service';
import { EquityProvider } from './equity.provider';

@Injectable({
  providedIn: 'root'
})
export class EquityService {

  private _selectedEquitySubject$ = new BehaviorSubject<Equity>({} as Equity);

  constructor(
    private _equityProvider: EquityProvider,
    private _geographyService: GeographyService
  ) {}

  equity$(id: string): Observable<Equity> {

    return this._selectedEquitySubject$.asObservable()
      .pipe(
        switchMap(equity =>
          equity && Object.keys(equity).length > 0 && equity._id === id
          ? of(equity)
          : this._equityProvider.getEquity(id)
            .pipe(
              tap( (data: Equity) => this._selectedEquitySubject$.next(data))
            )
        )
      );
  }

  getExposureGeo(): Observable<{ geoExposure: GeographyExposure, name: string }[]> {

    return this._selectedEquitySubject$.asObservable()
      .pipe(
        take(1),
        concatMap( (equity: Equity) => {
          const geographyExposure: GeographyExposure[] = equity.geographyExposure!; // Always present albeit empty.

          return this._geographyService.geographyList$ // Avoid unecessary DB calls by using state value.
            .pipe(
              take(1),
              map( (list: Geography[]) => {
                return list
                  .map(geo => {
                    const exposure = geographyExposure.filter( expo => expo.geographyId === geo._id)[0];
                    return { geoExposure: exposure ? exposure : { geographyId: geo._id, exposure: 0 }, name: geo.name };
                  })
              })
            );
        })
      );
  }

  exposureSubmit(formArray: any, type: 'geo' | 'sec'): void {
    console.log(formArray)
  }
}
