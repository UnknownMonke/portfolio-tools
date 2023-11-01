import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { ProgressSpinnerModule } from 'src/app/common/components/progress-spinner/progress-spinner.component';
import { Equity } from 'src/app/common/models/equity';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioTableModule } from '../portfolio-table/portfolio-table.component';

/**
 * Container component to display portfolios from different brokers.
 *
 * ---
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
 *
 * - Store the portfolio is session to avoid refreshing everytime the view is displayed.
 *   Refreshing the data is only triggered by the user.
 *
 * The portfolio is fully loaded and updated on every refresh.
 *
 * Exposure is not updated and must be done manually for each new Equity.
 * Clicking on an Equity name links to its own view where exposure can be edited.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-portfolio-view',
  templateUrl: './portfolio-view.component.html',
  styleUrls: ['./portfolio-view.component.scss']
})
export class PortfolioViewComponent implements OnInit {

  readonly data$: Observable<Equity[]>;

  constructor(
    private _portfolioService: PortfolioService
  ) {
    this.data$ = this._portfolioService.portfolioData$;
  }

  ngOnInit(): void {
    this._portfolioService.load();
  }

  import(): void {
    this._portfolioService.import();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PortfolioViewComponent],
  exports: [PortfolioViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProgressSpinnerModule,
    ButtonModule,
    PortfolioTableModule
  ]
})
export class PortfolioViewModule {}
