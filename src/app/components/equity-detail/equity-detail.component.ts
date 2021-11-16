import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Equity } from 'src/app/models/equity';

@Component({
  selector: 'app-equity-detail',
  templateUrl: './equity-detail.component.html',
  styleUrls: ['./equity-detail.component.scss']
})
export class EquityDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getEquity();
  }

  getEquity(): void {
    //TODO subscription ?
    const id = Number(this.route.snapshot.paramMap.get('id'));
    /*const equity: Equity = new Equity(
      Number("1"),
      "Microsoft Corp",
      "MSFT",
      'STOCK',
      true,
      'EUR',
      2,
      579.51
    );
    equity.sectors = [
      {
        sectorId: 1,
        sector: "Video Games",
        exposure: 0.3
      },
      {
        sectorId: 2,
        sector: "IT & Services",
        exposure: 0.7
      }
    ];
    equity.geography = [
      {
        regionId: 1,
        region: "USA",
        exposure: 1
      }
    ]*/
    //return equity;
    //TODO persistence
  }
}
