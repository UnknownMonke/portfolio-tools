import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Equity } from 'src/app/models/equity';
import { GeographyExposition } from 'src/app/models/geographyExposition';
import { SectorExposition } from 'src/app/models/sectorExposition';
import { EquityService } from 'src/app/services/equity/equity.service';
import { SectorEditComponent } from '../sector-edit/sector-edit.component';

/**
 * Composant wrapper pour l'édition de la répartition d'une équité.
 *
 * - Récupère l'équité sélectionnée via son id, et la transmet aux enfants (geography et sector).
 * - Affiche les données financières de l'équité.
 */
@Component({
  selector: 'app-equity-detail',
  templateUrl: './equity-detail.component.html',
  styleUrls: ['./equity-detail.component.scss']
})
export class EquityDetailComponent implements OnInit {

  equity: Equity = {} as Equity;

  // Utilisation du viewChild pour les secteurs.
  @ViewChild(SectorEditComponent) child: any;

  constructor(
    private route: ActivatedRoute,
    private equityService: EquityService
  ) {}

  ngOnInit(): void {
    this.getEquity();
  }

  // L'id est disponible dans l'url.
  getEquity(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id !== null) {
      this.equityService.getEquity(id)
        .subscribe( (data: Equity) => {
          this.equity = data;
          this.child.fillExposition(this.equity.sectors);
        });
    } else {
      //TODO display error
    }
  }

  // Persiste la répartition provenant de l'EventEmitter.
  updateEquityGeography($event: GeographyExposition[]): void {
    this.equity.geography = $event;

    this.equityService.editEquity(this.equity)
      .subscribe( (status: number) => {
        if(status !== 200) {
          //TODO error
        }
      });
  }

  // Persiste la répartition provenant de l'EventEmitter.
  updateEquitySector($event: SectorExposition[]): void {
    this.equity.sectors = $event;

    this.equityService.editEquity(this.equity)
    .subscribe( (status: number) => {
      if(status !== 200) {
        //TODO error
      }
    });
  }
}
