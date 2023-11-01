import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Equity } from 'src/app/common/models/equity';
import { EquityService } from 'src/app/equities/services/equity.service';
import { EQUITIES } from '../../common/constants/mock-equities';

/**
 * Service de login et récupération du portfolio et des balances DeGiro, depuis click sur bouton refresh
 * - Récupération des données et conversion en DTO
 * - Persistence du DTO:
 *  - Ajout sans exposure si l'actif n'existe pas en base
 *  - Mise à jour de l'actif sauf l'exposure si l'actif existe
 *
 *
 *
 * Portfolio loading strategy :
 *
 * - On init, loads the data from the session.
 * - If no data is present, the pages displays an empty message.
 *
 * - The data then needs to be imported from a csv file using the import button.
 *
 * - Compare Equities with the portfolio stored in the database, and updates the database :
 *    - Maps Equities to their entity and search for a persisted existing Entity, with same id, name, ticker and type.
 *    - If only the id changed, updates the id.
 *    - Else, adds the equity as new, and deactivates but does not delete the old Equity.
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private _portfolioDataSubject = new BehaviorSubject<Equity[]>([]);

  portfolioData$: Observable<Equity[]> = this._portfolioDataSubject.asObservable();

  constructor(
    private equityService: EquityService
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
      .map((position) => new Equity(position));

    // Load equities in base and search for a persisted existing Entity, with same id, name, ticker and type.
    /*const portfolioMap = new Map<string, Equity>();
    portfolioData.forEach(equity => portfolioMap.set(equity._id, equity));*/

    //console.log(portfolioMap)

    /*this.equityService.getEquities()
      .pipe(
        takeUntil(this.isDead$),
        map( (data: Equity[]) => {
          this.persistEquities(data, portfolioData, portfolioMap);
        })
      ).subscribe();*/

    sessionStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    this._portfolioDataSubject.next(portfolioData);
  }

  equals(equity: Equity, other: Equity): boolean {
    return equity._id === other._id
      && equity.name === other.name
      && equity.ticker === other.ticker
      && equity.type === other.type;
  }

  /**
   * - Récupère les actifs actuellement en base
   *  - Actif toujours présent mais activé ou déactivé pour les positions cloturées
   *  - Actif non présent = nouvelle position à rajouter
   */
  persistEquities(equities: Equity[], portfolioData: Equity[], equityMap: Map<string, Equity>): void {

    if(equities) {
      const dataMap = new Map<string, Equity>();
      equities.map(equity => dataMap.set(equity._id, equity));

      // For each loaded equity
      portfolioData.forEach(candidate => {
        this.updateEquityMap(candidate, equities, equityMap);
      });

      this.equityService.deleteEquities() //pas de subscribe dans les subscribe
        .pipe(
          //takeUntil(this.isDead$),
          map( (success: boolean) => {

            if(success) {
              this.equityService.addEquities([...dataMap.values()])
                .pipe(
                  //takeUntil(this.isDead$),
                  map( (success: boolean) => {
                    if(success) {
                      this._portfolioDataSubject.next(portfolioData);
                    }
                  })
                ).subscribe();
            }
          })
        ).subscribe();

    } else {
      this.equityService.addEquities(portfolioData)
        .pipe(
          //takeUntil(this.isDead$),
          map( (success: boolean) => {
            if(success) {
              this._portfolioDataSubject.next(portfolioData);
            }
          })
        ).subscribe();
    }
  }

  updateEquityMap(candidate: Equity, equities: Equity[], equityMap: Map<string, Equity>): Map<string, Equity> {
    // if an existing id is found
    if(equityMap.has(candidate._id)) {
      const equity: Equity | undefined = equityMap.get(candidate._id);

      //console.log(equity);
      //console.log(candidate);

      // verify that the equity is the same, else
      //TODO using class property doesnt work
      if(equity && !this.equals(equity, candidate)) {
        throw new Error(`Error: The equity with id ${equity?._id} clashes with an existing one.`);
      }

    } else { // no id is found, id may have changed or equity is new.
      const possibleEquity = equities.filter(equity => candidate.simpleEquals(equity));

      if(possibleEquity && possibleEquity.length > 0) {
        equityMap.set(candidate._id, possibleEquity[0]); // replace the old equity with the new one
        equityMap.delete(possibleEquity[0]._id);
      } else {
        equityMap.set(candidate._id, candidate);
      }
    }
    return equityMap;
  }
}
