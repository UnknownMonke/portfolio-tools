import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, first, map, of, take } from 'rxjs';
import { Equity } from 'src/app/common/models/equity';
import { EquityProvider } from 'src/app/equities/services/equity.provider';
import { EQUITIES } from '../../common/constants/mock-equities';

/**
 * Portfolio loading strategy :
 *
 * - On init, loads the data from the session.
 * - If no data is present, the pages displays an empty message.
 *
 * - The data then needs to be imported from a csv file using the import button.
 *
 * - After import, update the database :
 *    - Maps Equities to their entity and search for a persisted existing entity, with same id, name, ticker and type.
 *    - Since we want to keep the existing exposure for the stored equities :
 *      - Updates existing equities in place, with amount, new brokerId if necessary, etc.
 *      - Keeps old equities with status inactive.
 *      - Add new equities with empty exposure.
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private _portfolioDataSubject = new BehaviorSubject<Equity[]>([]);

  portfolioData$: Observable<Equity[]> = this._portfolioDataSubject.asObservable();

  constructor(
    private _equityProvider: EquityProvider
  ) {}

  load(): void {
    const data = sessionStorage.getItem('portfolioData');

    if(data !== null) {
      this._portfolioDataSubject.next(JSON.parse(data));
    } else {
      this.import();
    }
  }

  import(): void {
    const portfolio = EQUITIES;

    let portfolioData: Equity[] = portfolio
      .filter(val => val.positionType === "PRODUCT")
      .map((position) => new Equity(position)); // Maps only broker values (without exposure by default).

    this._updateEquities(portfolioData);
  }

  equals(equity: Equity, other: Equity): boolean {
    return equity._id === other._id
      && equity.name === other.name
      && equity.ticker === other.ticker
      && equity.type === other.type;
  }

  //TODO TUs
  private _updateEquities(importedData: Equity[]): void {

    let newEquities: Equity[] = [];

    this._equityProvider.getEquities()
      .pipe(
        first(), // Terminates after one value.
        concatMap( (equities: Equity[]) => { // concatMap will execute Observables only when previous one emits (in order).

          if(equities && equities.length > 0) {

            // Set to map.
            const existingMap = new Map<string, Equity>(equities.map( equity => [equity._id, equity] ));
            const importedMap = new Map<string, Equity>(importedData.map( equity => [equity._id, equity] ));

            importedData.forEach( (importedEquity: Equity) => {
              // Transferts exposure and update the equity with new values.
              if(existingMap.has(importedEquity._id)) {

                const existingEquity = existingMap.get(importedEquity._id);
                importedEquity.setExposure(existingEquity?.geographyExposure?? [], existingEquity?.sectorExposure?? []);
              }
              existingMap.set(importedEquity._id, importedEquity);
            });

            // Finds unused equities and set them to inactive.
            equities.forEach( (existingEquity: Equity) => {

              if(!importedMap.has(existingEquity._id) && existingEquity.active) {
                existingEquity.active = false;

                existingMap.set(existingEquity._id, existingEquity);
              }
            });
            newEquities = [...existingMap.values()];

          } else { // Adds all with empty exposure.
            importedData = importedData
              .map( (equity: Equity) => equity.setExposure([], []));

              newEquities = importedData;
          }

          // Delete all existing equities and persists the updated one. Only 3 DB operations required.
          return this._equityProvider.deleteEquities()
            .pipe(
              take(1),
              concatMap( (success: boolean) =>
                success ?
                  this._equityProvider.addEquities(newEquities)
                    .pipe(
                      take(1),
                      map( (success: boolean) => {
                        if(success) {
                          sessionStorage.setItem('portfolioData', JSON.stringify(newEquities));
                          this._portfolioDataSubject.next(newEquities);
                        }
                      })
                    )
                  : of() //TODO launch error
              )
            );
        })
      ).subscribe();
  }
}
