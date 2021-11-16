import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Equity } from '../models/equity';
import { Sector } from '../models/sector';
import { Geography } from '../models/geography';

/*------service de simulation d'api, renvoie des mocks après interception des requêtes http------*/
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() {}

  createDb() {
    const equities: Equity[] = [
      {
        equityId: Number("1"),
        name: "Microsoft Corp",
        ticker: "MSFT",
        type: 'STOCK',
        active: true,
        currency: 'EUR',
        quantity: 2,
        amount: 579.51,
        geography: [
          {
            regionId: 1,
            region: "USA",
            exposure: 1
          }
        ],
        sectors: [
          {
            sectorId: 1,
            sector: "Video Games",
            exposure: 0.3
          },
          {
            sectorId: 2,
            sector: "IT & Services",
            exposure: 0.7
          }
        ]
      },
      {
        equityId: Number("2"),
        name: "NVIDIA Corp",
        ticker: "NVDA",
        type: 'STOCK',
        active: true,
        currency: 'EUR',
        quantity: 1,
        amount: 264.42,
        geography: [
          {
            regionId: 1,
            region: "USA",
            exposure: 1
          }
        ],
        sectors: [
          {
            sectorId: 1,
            sector: "Video Games",
            exposure: 0.3
          },
          {
            sectorId: 2,
            sector: "Hardware",
            exposure: 0.7
          }
        ]
      }
    ];
    return {equities};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(equities: Equity[]): number {
    return equities.length > 0 ? Math.max(...equities.map(equity => equity.equityId)) + 1 : 11;
  }
}
