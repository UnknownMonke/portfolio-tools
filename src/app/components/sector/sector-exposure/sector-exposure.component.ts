import { Component, OnInit } from '@angular/core';
import { Equity } from 'src/app/models/equity';
import { Sector } from 'src/app/models/sector';
import { EquityService } from 'src/app/services/equity/equity.service';
import { SectorService } from 'src/app/services/sector/sector.service';


//TODO couleur pour chaque catégorie de secteur
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

          this.sectorService.getSectors()
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
                      // Version formattée pour la table nom: exposure
                      Object.defineProperty(o, sector.name.replace(' ', ''),
                        {
                          value: equity.sectors.length > 0
                          ? equity.sectors // Assigne l'exposure trouvée si elle existe, sinon 0
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

  getTotals(sectorNameList: string[]): void {
    this.sectorTotal = {};

    sectorNameList.forEach(name => {
      const value: number = this.getTotalBySector(name);
      Object.defineProperty(this.sectorTotal, name.replace(' ', ''), { value: value });
      this.graphData.set(name, value); // Map pour plus de facilité au graphe
    });
  }

  // Moyenne de la répartition par secteur pondérée par la valeur totale de l'équité
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
