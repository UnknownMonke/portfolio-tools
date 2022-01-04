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
                //const sectorNameList = sectorList.map(sec => sec.name);

                const sectorData: any[] = equities
                  .filter(equity => equity.active)
                  .map(equity => {
                    const mainSectors: any = {};
                    const subSectors: any = {};

                    sectorList.forEach(sector => {
                      const o = sector.level === 0 ? mainSectors : subSectors;
                      // Version formattée pour la table nom: exposure
                      Object.defineProperty(o, sector.name.replace(' ', ''),
                        {
                          value: equity.sectors.length > 0
                          ? equity.sectors // Assigne l'exposure trouvée si elle existe, sinon 0
                            .filter(sec => sector.name === sec.sector.name)[0].exposure : 0
                        }
                      );
                    })
                    return {
                      equityName: equity.name,
                      amount: equity.amount,
                      mainSectors: mainSectors,
                      subSectors: subSectors
                    };
                  });


                /*sectorList
                  .filter(sector => sector.level === 0)
                  .forEach(sector => treeNodeData.push({
                    data: {
                      sector: sector,
                      exposures: {}
                    },
                    expanded: true,
                    children: []
                  }));

                treeNodeData.forEach(node =>
                  sectorList
                    .filter(sector => sector.parentId === node.data?._id)
                    .forEach(subsector => node.children?.push({
                      data: {
                        sector: subsector,
                        exposures: {}
                      },
                      expanded: true
                    }))
                  );*/


                this.sectorData = sectorData;
                console.log(this.sectorData);

                this.sectorMap = sectorList.map(sector => {
                  return { field: sector.name.replace(' ', ''), header: sector.name, level: sector.level }
                });
                //this.getTotals(sectorNameList);
                this.loaded = true;
              }
            });
        }
      });
  }

  private mapSectorExposureDto(equity: Equity, sectorList: Sector[]): any {
    const mainSectors: any[] = [];
    const subSectors: any[] = [];

    sectorList.forEach(sector => {
      const o = {
        name: sector.name,
        exposure: equity.sectors.length > 0
        ? equity.sectors // Assigne l'exposure trouvée si elle existe, sinon 0
          .filter(sec => sector.name === sec.sector.name)[0].exposure : 0
      };
      sector.level === 0 ? mainSectors.push(o) : subSectors.push(o);
    })

    return {
      equityName: equity.name,
      amount: equity.amount,
      mainSectors: mainSectors,
      subSectors: subSectors
    };
  }

  getTotals(sectorNameList: string[]): void {
    this.sectorTotal = {};

    sectorNameList.forEach(name => {
      Object.defineProperty(this.sectorTotal, name.replace(' ', ''), { value: this.getTotalBySector(name) });
      this.graphData.set(name, this.getTotalBySector(name)); // Map pour plus de facilité au graphe
    });
  }

  // Moyenne de la répartition par secteur pondérée par la valeur totale de l'équité
  getTotalBySector(sector: string): number {

    const sectorCode = sector.replace(' ', '');
    const sectorExposureAmountMap = new Map();

    this.sectorData.forEach(sectorList => {
      if(sectorList.hasOwnProperty(sectorCode)) {
        sectorExposureAmountMap.set(sectorList.amount, sectorList[sectorCode]);
      } else {
        sectorExposureAmountMap.set(sectorList.amount, 0);
      }
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

  private generateNodeList(sectorList: Sector[]): void {
    const treeNodeData: any[] = [];

    sectorList
      .filter(sector => sector.level === 0)
      .forEach(sector => treeNodeData.push({
        data: {
          sector: sector
        },
        expanded: true,
        children: []
      }));

    treeNodeData.forEach(node =>
      sectorList
        .filter(sector => sector.parentId === node.data?._id)
        .forEach(subsector => node.children?.push({
          data: subsector,
          expanded: true
        }))
      );
    this.sectorData = [...treeNodeData]; // Force la maj du composant
  }
}
