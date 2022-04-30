import { Injectable } from '@angular/core';
import { Equity } from 'src/app/equity/model/equity';
import { EQUITIES } from '../../common/constants/mock-equities';
import { environment } from 'src/environments/environment';
import DeGiro, { DeGiroEnums, DeGiroTypes } from 'degiro-api'
import { EquityService } from 'src/app/equity/service/equity.service';
import { BehaviorSubject, map, Observable, Subject, takeUntil, tap } from 'rxjs';
const { PORTFOLIO_POSITIONS_TYPE_ENUM } = DeGiroEnums;

//TODO install eslint, jest cypress, prettier, desinstall karma, single file component if possible, (empty files takes time and place in compilation)
//TODO name ='a' { name: name } => { name } shorthand
//TODO nullish coalescing
/*
use partial type instead of any for objects without id
type unknown instead of any, then cast it, (blocks the use of object before casting)

cast object as const makes it immutable (also readonly<>)
use generic types
ReturnType<typeof function> casts to the type of function return value

adds _ after private variables

use var declaration in constructor: constructor(public name : string) {}

immutability : { ...user, age: 12} adds age to user object via a new object

use inline enums : pruduct: 'a' | 'b' = 'a'
or code: `FR${string}`

utiliser des ng-content ou des templates pour placer les loader ou préload les layout, ou load des infos comme le titre de la page dans un composant container

use destructuring : ([arg1, arg2]) => arg1.set...

ne pas mettre de else dans le ngif, utiliser un autre ngif dans le template

*/


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
 * - Loads the portfolio from the broker.
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

  isDead$: Subject<boolean> = new Subject();

  portfolioDataSubject: BehaviorSubject<Equity[]> = new BehaviorSubject<Equity[]>([]);

  constructor(
    private equityService: EquityService
  ) {}


  set() {
    const data = sessionStorage.getItem('portfolioData');

    if(data !== null) {
      this.portfolioDataSubject.next(JSON.parse(data));
    } else {
      this.load();
    }
  }

  //private portfolioUrl = 'portfolio';
  //TODO version demo
  //TODO unsubscribe observables or use async pipe
  async load(): Promise<void> {



    /*const degiro = DeGiro.create({username: environment.degiroUser, pwd: environment.degiroPassword});

    if(!await degiro.isLogin({ secure: true })) {
      const accountData = await degiro.login();
      console.log(accountData);
    }

    const jsessionId = degiro.getJSESSIONID();
    console.log(jsessionId);


    // Load portfolio
    const portfolio = await degiro.getPortfolio({
      type: PORTFOLIO_POSITIONS_TYPE_ENUM.ALL,
      getProductDetails: true,
    });*/

    const portfolio = EQUITIES;

    //console.log(portfolio)


    let portfolioData: Equity[] = [];

    // Maps Equities to their entity
    portfolio
      .filter(val => val.positionType === "PRODUCT")
      .forEach(function(position) {
        const equity = new Equity(position);
        portfolioData.push(equity);
      });


    // Load equities in base and search for a persisted existing Entity, with same id, name, ticker and type.
    const portfolioMap = new Map<string, Equity>();
    portfolioData.forEach(equity => portfolioMap.set(equity._id, equity));

    //console.log(portfolioMap)

    this.equityService.getEquities()
      .pipe(
        takeUntil(this.isDead$),
        map( (data: Equity[]) => {
          this.persistEquities(data, portfolioData, portfolioMap);
        })
      ).subscribe();
  }

  equals(equity: Equity, other: Equity): boolean {
    return equity._id === other._id
      && equity.name === other.name
      && equity.ticker === other.ticker
      && equity.type === other.type;
  }

  leave(): void {
    (async () => {
      const degiro = new DeGiro({});
      if(await degiro.isLogin({ secure: true })) {
        await degiro.logout();
      }
    })();
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
          takeUntil(this.isDead$),
          map( (success: boolean) => {

            if(success) {
              this.equityService.addEquities([...dataMap.values()])
                .pipe(
                  takeUntil(this.isDead$),
                  map( (success: boolean) => {
                    if(success) {
                      this.portfolioDataSubject.next(portfolioData);
                    }
                  })
                ).subscribe();
            }
          })
        ).subscribe();

    } else {
      this.equityService.addEquities(portfolioData)
        .pipe(
          takeUntil(this.isDead$),
          map( (success: boolean) => {
            if(success) {
              this.portfolioDataSubject.next(portfolioData);
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

@Injectable({
  providedIn: 'root'
})
export class PortfolioFacade {

  // Exposes the Subject as Observable to make it read-only for subscribers (cannot call next on it).
  portfolioData$: Observable<Equity[]> = this._portfolioService.portfolioDataSubject.asObservable()
    .pipe(
      tap( (data: Equity[]) => sessionStorage.setItem('portfolioData', JSON.stringify(data)))
    );

  constructor(
    private _portfolioService: PortfolioService
  ) {}
}
