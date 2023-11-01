import { Injectable } from "@angular/core";
import { Observable, shareReplay, tap } from "rxjs";
import { Equity } from "../models/equity";
import { StateService } from "./state.service";

/**
 * Holds the Portfolio Equities data state.
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService extends StateService<Equity[]> {

  portfolioData$: Observable<Equity[]> = this.select(state => state);

  constructor() {
    super([]);
  }

  setState(data: Equity[]): void {
    this.state = data;
  }

  get() {
    return this.state;
  }
}
