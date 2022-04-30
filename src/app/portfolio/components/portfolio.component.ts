import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { PortfolioFacade, PortfolioService } from '../services/portfolio.service';
import { LoadingFacade } from 'src/app/handling/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule } from '@angular/router';
import { PortfolioTableModule } from './portfolio-table/portfolio-table.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  constructor(
    public loadingFacade: LoadingFacade,
    private portfolioService: PortfolioService,
    public portfolioFacade: PortfolioFacade
  ) {}

  ngOnInit(): void {
    this.portfolioService.set();
  }

  refresh(): void {
    this.portfolioService.load();
  }

  ngOnDestroy(): void {
    this.portfolioService.isDead$.next(false);
  }

}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PortfolioComponent],
  exports: [PortfolioComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ProgressSpinnerModule,
    PortfolioTableModule
  ]
})
export class PortfolioModule {}
