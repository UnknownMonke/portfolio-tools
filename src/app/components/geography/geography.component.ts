import { Component, OnInit } from '@angular/core';
import { Geographies } from 'src/app/dto/geographies';
import { GEOGRAPHY } from 'src/app/dto/mock-geography';

@Component({
  selector: 'app-geography',
  templateUrl: './geography.component.html',
  styleUrls: ['./geography.component.scss']
})
export class GeographyComponent implements OnInit {

  geographicData: any[] = [];
  geographicTotal: any = {};

  regionMap: any[] = [];

  constructor() {}

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
