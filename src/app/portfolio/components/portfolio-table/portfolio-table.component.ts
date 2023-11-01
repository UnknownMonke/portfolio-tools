import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Equity } from 'src/app/common/models/equity';

/**
 * Presentational component to display the portfolio in a table.
 *
 * ---
 *
 * Encapsulates the PrimeNG table with all config.
 *
 * Only displays the data and handles simple redirects.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-portfolio-table',
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.scss']
})
export class PortfolioTableComponent {

  readonly portfolioColumns: { field: string, header: string }[] = [
    { field: 'name', header: 'Name'},
    { field: 'ticker', header: 'Ticker'},
    { field: 'type', header: 'Type'},
    { field: 'quantity', header: 'Quantity'},
    { field: 'amount', header: 'Total amount'},
    { field: 'source', header: 'Source'}
  ];

  @Input() portfolioData: Equity[] | null = [];
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PortfolioTableComponent],
  exports: [PortfolioTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    TableModule
  ]
})
export class PortfolioTableModule {}
