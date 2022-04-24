import { Component, NgModule, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { LoadingService } from 'src/app/handling/services/loading/loading.service';
import { Equity } from 'src/app/equity/model/equity';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

/**
 * Component to load, save and display portfolios from different brokers.
 *
 * ---
 *
 * Portfolio loading strategy :
 *
 * - Loads the portfolio from the broker.
 *
 * - Compare Equities with the portfolio stored in the database, and updates the database :
 *    - Maps Equities to their entity and search for a persisted existing Entity, with same id, name, ticker and type.
 *    - If only the id changed, updates the id.
 *    - Else, adds the equity as new, and deactivates but does not delete the old Equity.
 *
 * - Store the portfolio is session to avoid refreshing everytime the view is displayed.
 *   Refreshing the data is only triggered by the user.
 *
 * The portfolio is fully loaded and updated on every refresh.
 *
 * Exposure is not updated and must be done manually for each new Equity.
 * Clicking on an Equity name links to its own view where exposure can be edited.
 *
 */
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolioData: Equity[] = [];
  portfolioColumns: any[] = [];

  constructor(
    public loadingService: LoadingService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('portfolioData');

    if(data !== null) {
      this.portfolioData = JSON.parse(data);
    }

    this.portfolioColumns = [
      { field: 'name', header: 'Name'},
      { field: 'ticker', header: 'Ticker'},
      { field: 'type', header: 'Type'},
      { field: 'quantity', header: 'Quantity'},
      { field: 'amount', header: 'Total amount'}
    ];
  }

  refresh(): void {
    this.portfolioService.load().subscribe( (data: Equity[]) => {
      this.portfolioData = data;
    });

    sessionStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
    //TODO customAlert
  }

  // Charge les positions actives par défaut.
  //TODO donner la possibilité de voir les positions fermées
  //TODO fonction de sort séparée
  /*loadPortfolio(): Equity[] {
    return this.portfolioService.load()
      .filter(data => data.active)
      .sort( (a,b) => (a.type < b.type) ? 1 : (a.type === b.type) ? ( (a.name > b.name) ? 1 : -1) : -1);
  }*/
}

@NgModule({
  declarations: [PortfolioComponent],
  exports: [PortfolioComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule
  ]
})
export class PortfolioModule {}
