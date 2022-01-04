import { Component, Input, OnInit } from '@angular/core';

/** Affiche les données géographiques en table */
@Component({
  selector: 'app-geographic-exposure-table',
  templateUrl: './geographic-exposure-table.component.html',
  styleUrls: ['./geographic-exposure-table.component.scss']
})
export class GeographicExposureTableComponent implements OnInit {

  @Input() geographicData: any[] = [];
  @Input() geographicTotal: any = {};
  @Input() regionMap: any[] = [];

  geographicColumns: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setColumns();
  }

  // Construit les colonnes dynamiques depuis la map
  private setColumns(): void {
    this.geographicColumns = [
      {field: 'name', header: 'Name'},
      {field: 'amount', header: 'Amount'}
    ];
    this.regionMap.forEach(region => this.geographicColumns.push(region));

    // Ajoute le total global
    const totalAmount = this.geographicData
      .map(geoData => geoData.amount)
      .reduce((geoData, next) => geoData + next);

    this.geographicTotal.name = 'Total';
    this.geographicTotal.amount = totalAmount;
  }
}
