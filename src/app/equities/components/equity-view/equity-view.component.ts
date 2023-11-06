import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { EMPTY, Observable } from 'rxjs';
import { GeographyExposure } from 'src/app/common/models/geography';
import { Equity } from '../../../common/models/equity';
import { EquityService } from '../../services/equity.service';
import { EquityPanelModule } from '../equity-panel/equity-panel.component';
import { GeoEditModule } from '../geo-edit/geo-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equity-view',
  templateUrl: './equity-view.component.html',
  styleUrls: ['./equity-view.component.scss']
})
export class EquityViewComponent implements OnInit {

  equity$: Observable<Equity> = EMPTY;
  // Like all forms, the data must be passed to the form component as input.
  mappedExposure$: Observable<{ geoExposure: GeographyExposure, name: string }[]> = EMPTY;

  constructor(
    private _route: ActivatedRoute,
    private _equityService: EquityService
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');

    if(id !== null) {
      this.equity$ = this._equityService.equity$(id);
      this.mappedExposure$ = this._equityService.getExposureGeo();
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [EquityViewComponent],
  exports: [EquityViewComponent],
  imports: [
    CommonModule,
    DividerModule,
    EquityPanelModule,
    GeoEditModule
  ],
})
export class EquityViewModule {}
