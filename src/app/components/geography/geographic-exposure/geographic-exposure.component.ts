import { Component, OnInit } from '@angular/core';
import { Equity } from 'src/app/models/equity';
import { Geography } from 'src/app/models/geography';
import { EquityService } from 'src/app/services/equity/equity.service';
import { GeographyService } from 'src/app/services/geography/geography.service';


@Component({
  selector: 'app-geographic-exposure',
  templateUrl: './geographic-exposure.component.html',
  styleUrls: ['./geographic-exposure.component.scss']
})
export class GeographicExposureComponent implements OnInit {

  geographicData: any[] = [];
  geographicTotal: any = {};
  graphData: any = {};
  regionMap: any[] = [];
  loaded: boolean = false;

  constructor(
    private equityService: EquityService,
    private geographyService: GeographyService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.equityService.getEquities()
      .subscribe((data: Equity[]) => {

        if(data.length > 0) {

          this.geographyService.getGeographies()
            .subscribe( (geoData: Geography[]) => {

              if(geoData.length > 0) {
                const geographyNameList = geoData.map(geo => geo.name);

                // Mappe le nom et les exposure pour les géographies disponibles
                const geographicData: any[] = [];
                data
                  .filter(equity => equity.active)
                  .forEach(equity => {

                    const o = {
                      name: equity.name,
                      amount: equity.amount
                    };

                    geographyNameList
                      .forEach(name => {
                        // Version formattée pour la table nom: exposure
                        Object.defineProperty(o, name.replace(' ', ''),
                          {
                            value: equity.geography.length > 0
                            ? equity.geography // Assigne l'exposure trouvée si elle existe, sinon 0
                              .filter(geo => name === geo.geography.name)[0].exposure : 0
                          }
                        );
                      });
                    geographicData.push(o);
                  });
                this.geographicData = geographicData;
                this.regionMap = geographyNameList.map(name => {
                  return { field: name.replace(' ', ''), header: name }
                });
                this.getTotals(geographyNameList);
                this.loaded = true;
              }
            });
        }
      });
  }

  getTotals(geographyNameList: string[]): void {
    this.geographicTotal = {};
    this.graphData = {};

    geographyNameList.forEach(name => {
      Object.defineProperty(this.geographicTotal, name.replace(' ', ''), { value: this.getTotalByRegion(name) });
      Object.defineProperty(this.graphData, name.replace(' ', ''), { value: this.getTotalByRegion(name) });
    });
  }

  // Moyenne de la répartition par région pondérée par la valeur totale de l'équité
  getTotalByRegion(region: string): number {

    const regionCode = region.replace(' ', '');
    const regionExposureAmountMap = new Map();

    this.geographicData.forEach(geoData => {
      if(geoData.hasOwnProperty(regionCode)) {
        regionExposureAmountMap.set(geoData.amount, geoData[regionCode]);
      } else {
        regionExposureAmountMap.set(geoData.amount, 0);
      }
    });

    const weights = Array.from(regionExposureAmountMap.keys());
    const values = Array.from(regionExposureAmountMap.values());

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
