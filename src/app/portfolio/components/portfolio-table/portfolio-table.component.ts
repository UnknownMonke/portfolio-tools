import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Equity } from 'src/app/equity/model/equity';

@Component({
  selector: 'app-portfolio-table',
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.scss']
})
export class PortfolioTableComponent {

  portfolioColumns: { field: string, header: string }[] = [
    { field: 'name', header: 'Name'},
    { field: 'ticker', header: 'Ticker'},
    { field: 'type', header: 'Type'},
    { field: 'quantity', header: 'Quantity'},
    { field: 'amount', header: 'Total amount'}
  ];

  @Input()
  portfolioData: Equity[] | null = [];

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
