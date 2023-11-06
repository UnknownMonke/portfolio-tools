import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GeographyProvider } from 'src/app/edition/services/geography.provider';
import { EquityProvider } from 'src/app/equities/services/equity.provider';
import { ExposureGraphModule } from 'src/app/graphs/components/exposure-graph/exposure-graph.component';
import { GeographicExposureTableModule } from '../geographic-exposure-table/geographic-exposure-table.component';

//TODO edition de l'equité depuis la table
/**
 * Composant wrapper pour l'affichage de la répartition géographique globale.
 *
 * Affichage sous forme de table et de graphique (enfants).
 *
 * Le nom de la géographie est utilisé comme id en cas de suppression / recréation.
 *
 * Une modification de nom entraine le non-affichage de l'exposure, car la donnée est dupliquée dans le document,
 * il faut remettre à jour l'équité manuellement depuis la vue associée.
 */
@Component({
  selector: 'app-geographic-exposure',
  templateUrl: './geographic-exposure.component.html',
  styleUrls: ['./geographic-exposure.component.scss']
})
export class GeographicExposureComponent implements OnInit {

  geographicData: any[] = [];
  geographicTotal: any = {};
  graphData: Map<string, number> = new Map();
  regionMap: any[] = [];

  loaded: boolean = false;

  constructor(
    private equityService: EquityProvider,
    private geographyService: GeographyProvider
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    /*this.equityService.getEquities()
      .subscribe( (equities: Equity[]) => {

        if(equities.length > 0) {

          this.geographyService.get()
            .subscribe( (geoData: Geography[]) => {

              if(geoData.length > 0) {
                const geographyNameList = geoData.map(geo => geo.name);

                const geographicData: any[] = [];

                equities
                  .filter(equity => equity.active)
                  .forEach(equity => {

                    const o = {
                      name: equity.name,
                      amount: equity.amount
                    };

                    geographyNameList
                      .forEach(name => { //TODO map()
                        // Version formattée pour la table nom: exposure.
                        Object.defineProperty(o, name.replace(' ', ''),
                          {
                            value: equity.geography.length > 0
                            ? equity.geography // Assigne l'exposure trouvée si elle existe, sinon 0.
                              .filter(geo => 0) : 0
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
      });*/
  }

  // Ajout d'une ligne total par équité dans un objet séparé.
  private getTotals(geographyNameList: string[]): void {
    this.geographicTotal = {};

    geographyNameList.forEach(name => {
      const value: number = this.getTotalByRegion(name);
      Object.defineProperty(this.geographicTotal, name.replace(' ', ''), { value: value });
      this.graphData.set(name, value); // Map pour plus de facilité au graphe.
    });
  }

  //TODO TU
  // Moyenne de la répartition par région pondérée par la valeur totale de l'équité.
  private getTotalByRegion(region: string): number {
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

@NgModule({
  declarations: [GeographicExposureComponent],
  exports: [GeographicExposureComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    GeographicExposureTableModule,
    ExposureGraphModule
  ]
})
export class GeographicExposureModule {}
