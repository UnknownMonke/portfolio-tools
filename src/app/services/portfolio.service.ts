import { Injectable } from '@angular/core';
import { Equity } from '../entities/equity';
import { EQUITIES } from '../entities/mock-equities';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }

  //private portfolioUrl = 'portfolio';

  load(): Equity[] {
    return EQUITIES;
  }
}
