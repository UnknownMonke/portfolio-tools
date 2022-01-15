import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sector-exposure-table',
  templateUrl: './sector-exposure-table.component.html',
  styleUrls: ['./sector-exposure-table.component.scss']
})
export class SectorExposureTableComponent implements OnInit {

  /**
   * Prise des secteurs puis pour chaque secteur, ajout d'un object contenant tous les noms d'equité avec leur exposure si présent, 0 sinon
   */
  @Input() sectorData: any = {};
  @Input() sectorMap: any[] = [];

  sectorMainColumns: any[] = [];
  sectorSubColumns: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setColumns();
  }

  setColumns(): void {
    this.sectorMainColumns = [
      {field: 'equityName', header: 'Name'},
      {field: 'amount', header: 'Amount'}
    ].concat(this.sectorMap.filter(column => column.level === 0));

    this.sectorSubColumns = this.sectorMap.filter(column => column.level === 1);
  }
}
