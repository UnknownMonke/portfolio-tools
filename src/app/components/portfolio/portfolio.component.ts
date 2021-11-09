import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { Equity } from 'src/app/entities/equity';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.dtOptions
  }

  loadPortfolio(): Equity[] {
    return this.portfolioService.load();
  }

}
