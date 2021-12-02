import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sector } from 'src/app/models/sector';
import { SectorExposition } from 'src/app/models/sectorExposition';
import { SectorService } from 'src/app/services/sector/sector.service';

@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html',
  styleUrls: ['./sector-edit.component.scss']
})
export class SectorEditComponent implements OnInit {

  sectorTree: object[] = [];

  @Output() sectorRepartitionChange = new EventEmitter<any>();

  constructor(
    private sectorService: SectorService,
  ) {}

  ngOnInit(): void {}

  // Rempli la liste des secteurs avec les valeurs mappées en base et non les valeurs concaténées des equités
  fillExposition(sectorRepartition: SectorExposition[]): void {
    this.sectorService.getSectors()
      .subscribe( (data: Sector[]) => {

        if(data.length > 0) {

          const defaultSectors = data
            .map(sector => {
              return {
                sector: sector,
                exposure: 0
              };
            });

          // Edite la liste des repartitions avec les valeurs trouvées dans les équités
          if(sectorRepartition.length > 0) {

            defaultSectors.forEach(repartition => {
              const correspondingExpoMap = sectorRepartition
                .filter(expo => expo.sector._id === repartition.sector._id);

              if(correspondingExpoMap.length > 0) {
                repartition.exposure = correspondingExpoMap[0].exposure;
              }
            });
          }
          sectorRepartition = defaultSectors;

          this.sectorTree = this.buildTree(sectorRepartition);

        } else {
          //TODO error message
        }
      });
  }

  // Convertit la liste aplatie des secteurs en arbre pour affichage
  buildTree(sectorRepartition: SectorExposition[]): object[] {

  }
}
