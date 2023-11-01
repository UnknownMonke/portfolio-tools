import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { EMPTY, Observable, Subject, map, takeUntil } from 'rxjs';
import { GeographyExposition } from 'src/app/common/models/geography';
import { SectorExposition } from 'src/app/common/models/sector';
import { GeographyApiService } from 'src/app/edition/services/geography.provider';
import { GeographyService } from 'src/app/edition/services/geography.service';
import { Equity } from '../../common/models/equity';
import { EquityService } from '../services/equity.service';
import { GeoEditModule } from './geo-edit/geo-edit.component';

/**
 * Composant wrapper pour l'édition de la répartition d'une équité.
 *
 * - Récupère l'équité sélectionnée via son id, et la transmet aux enfants (geography et sector).
 * - Affiche les données financières de l'équité.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equity',
  templateUrl: './equity.component.html',
  styleUrls: ['./equity.component.scss']
})
export class EquityComponent implements OnInit, OnDestroy {

  private _isDead$: Subject<boolean> = new Subject();

  equity$: Observable<Equity> = EMPTY;

  equity: Equity = {} as Equity;

  repartition: GeographyExposition[] = [];




  //@ViewChild

  constructor(
    private route: ActivatedRoute,
    private equityService: EquityService,
    private geographyApiService: GeographyApiService,
    public geographyService: GeographyService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id !== null) {
      this.equity$ = this.equityService.getEquity(id)
        .pipe(
          takeUntil(this._isDead$),
          map( (equity: Equity) => {

            return equity;
          })
        );

      /*this.geographyService.geoRepartition$
        .pipe(
          takeUntil(this._isDead$)
        ).subscribe();*/
    }
  }

  setGeoRepartition(equity: Equity): void {


  }

  // Persiste la répartition provenant de l'EventEmitter.
  onGeoSubmit(event: GeographyExposition[]): void {

    console.log(event)
    /*this.equity.geography = $event;

    this.equityService.editEquity(this.equity)
      .subscribe();*/
  }

  // Persiste la répartition provenant de l'EventEmitter.
  onSectorSubmit($event: SectorExposition[]): void {
    /*this.equity.sectors = $event;

    this.equityService.editEquity(this.equity)
    .subscribe();*/
  }

  ngOnDestroy(): void {
    this._isDead$.next(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [EquityComponent],
  exports: [EquityComponent],
  imports: [
    CommonModule,
    PanelModule,
    DividerModule,
    GeoEditModule
  ],
})
export class EquityModule {}
