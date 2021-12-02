import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Equity } from 'src/app/models/equity';
import { GeographyExposition } from 'src/app/models/geographyExposition';
import { SectorExposition } from 'src/app/models/sectorExposition';
import { EquityService } from 'src/app/services/equity/equity.service';
import { SectorEditComponent } from '../sector-edit/sector-edit.component';

@Component({
  selector: 'app-equity-detail',
  templateUrl: './equity-detail.component.html',
  styleUrls: ['./equity-detail.component.scss']
})
export class EquityDetailComponent implements OnInit, AfterViewInit {

  equity: Equity = {} as Equity;

  //Utilisation du viewChild pour les secteurs
  @ViewChild(SectorEditComponent) child: any;

  constructor(
    private route: ActivatedRoute,
    private equityService: EquityService
  ) {}

  ngOnInit(): void {
    this.getEquity();
  }

  ngAfterViewInit(): void {
    this.child.fillExposition(this.equity.sectors);
  }

  getEquity(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id !== null) {
      this.equityService.getEquity(id)
        .subscribe( (data: Equity) => {
          this.equity = data;
        });
    } else {
      //TODO display error
    }
  }

  updateEquityGeography($event: GeographyExposition[]): void {
    this.equity.geography = $event;
    // Persistence
    this.equityService.editEquity(this.equity)
      .subscribe((status: number) => {
        if(status !== 200) {
          //TODO error
        }
      });
  }

  updateEquitySector($event: SectorExposition[]): void {

  }
}
