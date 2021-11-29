import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Equity } from 'src/app/models/equity';
import { EquityService } from 'src/app/services/equity/equity.service';

@Component({
  selector: 'app-equity-detail',
  templateUrl: './equity-detail.component.html',
  styleUrls: ['./equity-detail.component.scss']
})
export class EquityDetailComponent implements OnInit {

  equity: Equity = {} as Equity;

  constructor(
    private route: ActivatedRoute,
    private equityService: EquityService
  ) {}

  ngOnInit(): void {
    this.getEquity();
  }

  getEquity(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id !== null) {
      this.equityService.getEquity(id)
        .subscribe( (data: Equity) => this.equity = data)

    } else {
      //TODO display error
    }
  }
}
