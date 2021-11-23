import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { Equity } from 'src/app/models/equity';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolioData: Equity[] = [];
  portfolioColumns: any[] = [];

  loading: boolean = true;


  constructor(
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.portfolioData = this.loadPortfolio();

    this.loading = false;

    // Field name must be identical to the dto field name
    this.portfolioColumns = [
      { field: 'name', header: 'Name'},
      { field: 'ticker', header: 'Ticker'},
      { field: 'type', header: 'Type'},
      { field: 'quantity', header: 'Quantity'},
      { field: 'amount', header: 'Total amount'}
    ]
  }

  loadPortfolio(): Equity[] {
    return this.portfolioService.load()
      .filter(data => data.active);
  }

  refresh(): void {
    alert('refreshed'); //TODO customAlert
  }
}
