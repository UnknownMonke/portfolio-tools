import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { LoadingService } from 'src/app/services/handling/loading/loading.service';
import { Equity } from 'src/app/models/equity';


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
    // Field name must be identical to the dto field name
    this.portfolioColumns = [
      { field: 'name', header: 'Name'},
      { field: 'ticker', header: 'Ticker'},
      { field: 'type', header: 'Type'},
      { field: 'quantity', header: 'Quantity'},
      { field: 'amount', header: 'Total amount'}
    ];
  }

  loadPortfolio(): Equity[] {
    return this.portfolioService.load()
      .filter(data => data.active)
      .sort( (a,b) => (a.type < b.type) ? 1 : (a.type === b.type) ? ( (a.name > b.name) ? 1 : -1) : -1);
  }

  refresh(): void {
    this.portfolioData = this.loadPortfolio();
    sessionStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
    //TODO customAlert
  }
}
