import { Component, OnInit } from '@angular/core';
import { GEOGRAPHY } from 'src/app/common/constants/mock-geography';
import { Equity } from 'src/app/models/equity';
import { EquityService } from 'src/app/services/equity/equity.service';

@Component({
  selector: 'app-geographic-exposure',
  templateUrl: './geographic-exposure.component.html',
  styleUrls: ['./geographic-exposure.component.scss']
})
export class GeographicExposureComponent implements OnInit {

  geographicData: any[] = [];
  geographicTotal: any = {};

  equities: Equity[] = [];

  regionMap: any[] = [];

  constructor(
    private equityService: EquityService
  ) {}

  ngOnInit(): void {
    this.geographicData = this.loadGeography();

    const nameValueMap = new Map();
    GEOGRAPHY.forEach(value => nameValueMap.set(value.name, value.value));

    this.regionMap = [
      {field: 'usa', header: 'USA'},
      {field: 'can', header: 'Canada'},
      {field: 'euw', header: 'EU West'},
      {field: 'nor', header: 'Nordic'},
      {field: 'eue', header: 'EU East'},
      {field: 'jap', header: 'Japan'},
      {field: 'chi', header: 'China'}
    ]

    const totalAmount = this.geographicData
      .map(value => value.value)
      .reduce((value, next) => value + next);

    this.geographicTotal = {
      name: "Total",
      value: totalAmount,
      geography: {
        usa: this.getTotalByRegion('usa'),
        can: this.getTotalByRegion('can'),
        euw: this.getTotalByRegion('euw'),
        nor: this.getTotalByRegion('nor'),
        eue: this.getTotalByRegion('eue'),
        jap: this.getTotalByRegion('jap'),
        chi: this.getTotalByRegion('chi')
      }
    };

    console.log(this.geographicData);
  }

  loadEquities(): void {
    this.equityService.getEquities()
      .subscribe((data: Equity[]) => {
        this.equities = data;


      });
  }

  loadGeography(): any[] {
    return GEOGRAPHY;
  }

  //moyenne de la répartition par région pondérée par la valeur totale de l'équité
  getTotalByRegion(region: string): number {

    const regionValueAmountMap = new Map();

    const tempMap = new Map();
    GEOGRAPHY.forEach(value => tempMap.set(value.value, value.geography));

    tempMap.forEach((value, key) => {
      regionValueAmountMap.set(key, value[region]);
    });

    const weights = Array.from(regionValueAmountMap.keys());
    const values = Array.from(regionValueAmountMap.values());

    const result = values
      .map((el, i) => {
        const weight = weights[i];
        const sum = el*weight;
        return [sum, weight];
      })
      .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0]); //TODO calculs JS précision

    return result[0] / result[1]
  }
}
