import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { Location } from '@angular/common';

import { Equity } from 'src/app/dto/equity';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  portfolioData: Equity[] = [];
  portfolioColumns: any[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.portfolioData = this.loadPortfolio();

    this.portfolioColumns = [
      { field: 'name', header: 'Name'},
      { field: 'ticker', header: 'Ticker'},
      { field: 'type', header: 'Type'},
      { field: 'quantity', header: 'Quantity'},
      { field: 'amount', header: 'Total amount'}
    ]

  }

  loadPortfolio(): Equity[] {
    return this.portfolioService.load();
  }

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    alert('refreshed'); //TODO customAlert
  }

}
