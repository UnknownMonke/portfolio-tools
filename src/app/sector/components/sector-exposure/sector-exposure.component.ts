import { Component, OnInit } from '@angular/core';
import { EquityService } from 'src/app/equity/service/equity.service';
import { SectorService } from '../../service/sector.service';
import { Equity } from 'src/app/equity/model/equity';
import { Sector } from '../../model/sector';

//TODO couleur pour chaque catégorie de secteur
/**
 * Composant wrapper pour l'affichage de la répartition sectorielle globale.
 *
 * Affichage sous forme de table et de graphique (enfants).
 *
 * Le nom du secteur est utilisé comme id en cas de suppression / recréation.
 *
 * Une modification de nom entraine le non-affichage de l'exposure, car la donnée est dupliquée dans le document,
 * il faut remettre à jour l'équité manuellement depuis la vue associée.
 *
 * La donnée pour la table distingue les secteurs principaux dont le nom est le nom de propriété de l'objet (comme pour les autres tables dynamiques),
 * et les secteurs secondaires regroupées dans un sous-objet (condition obligatoire pour afficher le rowGroup PrimeNG).
 */
@Component({
  selector: 'app-sector-exposure',
  templateUrl: './sector-exposure.component.html',
  styleUrls: ['./sector-exposure.component.scss']
})
export class SectorExposureComponent implements OnInit {

  sectorData: any[] = [];
  sectorTotal: any = {};
  graphData: Map<string, number> = new Map();
  sectorMap: any[] = [];
  loaded: boolean = false;


  constructor(
    private equityService: EquityService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.equityService.getEquities()
      .subscribe( (equities: Equity[]) => {

        if(equities.length > 0) {

          this.sectorService.get()
            .subscribe( (sectorList: Sector[]) => {

              if(sectorList.length > 0) {
                const sectorNameList = sectorList.map(sec => sec.name);

                const sectorData: any[] = [];

                equities
                  .filter(equity => equity.active)
                  .forEach(equity => {
                    const sectorSingleData: any = {
                      equityName: equity.name,
                      amount: equity.amount
                    };
                    const subSectors: any = {
                      equityName: equity.name
                    };

                    sectorList.forEach(sector => {
                      const o = sector.level === 0 ? sectorSingleData : subSectors;
                      // Version formattée pour la table nom: exposure.
                      Object.defineProperty(o, sector.name.replace(' ', ''),
                        {
                          value: equity.sectors.length > 0
                          ? equity.sectors // Assigne l'exposure trouvée si elle existe, sinon 0.
                            .filter(sec => sector.name === sec.sector.name)[0].exposure : 0
                        }
                      );
                    });
                    sectorSingleData.subSectors = [subSectors];
                    sectorData.push(sectorSingleData);
                  });

                this.sectorData = sectorData;
                this.sectorMap = sectorList.map(sector => {
                  return { field: sector.name.replace(' ', ''), header: sector.name, level: sector.level }
                });
                this.getTotals(sectorNameList);
                this.loaded = true;
              }
            });
        }
      });
  }

  // Ajout d'une ligne total par équité dans un objet séparé.
  getTotals(sectorNameList: string[]): void {
    this.sectorTotal = {};

    sectorNameList.forEach(name => {
      const value: number = this.getTotalBySector(name);
      Object.defineProperty(this.sectorTotal, name.replace(' ', ''), { value: value });
      this.graphData.set(name, value); // Map pour plus de facilité au graphe.
    });
  }

  // Moyenne de la répartition par secteur pondérée par la valeur totale de l'équité.
  getTotalBySector(sector: string): number {
    const sectorCode = sector.replace(' ', '');
    const sectorExposureAmountMap = new Map();

    this.sectorData.forEach( (sectorList: any) => {
      if(sectorList.hasOwnProperty(sectorCode)) {
        sectorExposureAmountMap.set(sectorList.amount, sectorList[sectorCode]);
      } else {
        sectorExposureAmountMap.set(sectorList.amount, 0);
      }

      sectorList.subSectors.forEach( (sectors: any) => {
        if(sectors.hasOwnProperty(sectorCode)) {
          sectorExposureAmountMap.set(sectorList.amount, sectors[sectorCode]);
        }
      });
    });

    const weights = Array.from(sectorExposureAmountMap.keys());
    const values = Array.from(sectorExposureAmountMap.values());

    const result = values
      .map((el, i) => {
        const weight = weights[i];
        const sum = el*weight;
        return [sum, weight];
      })
      .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0]); //TODO calculs JS précision

    return result[0] / result[1];
  }
}
