import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Sector } from 'src/app/models/sector';


@Component({
  selector: 'app-sector-exposure-table',
  templateUrl: './sector-exposure-table.component.html',
  styleUrls: ['./sector-exposure-table.component.scss']
})
export class SectorExposureTableComponent implements OnInit {

  /**
   * Prise des secteurs puis pour chaque secteur, ajout d'un object contenant tous les noms d'equité avec leur exposure si présent, 0 sinon
   */
  @Input() sectorData: any[] = [];
  //@Input() sectorTotal: any = {};
  @Input() sectorMap: any[] = [];

  //sectorData: any[] = [];
  sectorMainColumns: any[] = [];
  sectorSubColumns: any[] = [];

  constructor() {}

  ngOnInit(): void {
    //console.log(this.sectorData);

    this.setColumns();
  }


  setColumns(): void {
    /*this.sectorMainColumns = [
      {field: 'equityName', header: 'Name'},
      {field: 'amount', header: 'Amount'}
    ];
    this.sectorData[0].mainSectors // Tous identiques
      .map( (mainSector: any) => mainSector.name)
      .forEach( (name: string) => this.sectorMainColumns.push({ field: name.replace(' ',''), header: name }));

    this.sectorSubColumns = [
      {field: 'equityName', header: 'Name'}
    ];
    this.sectorData[0].subSectors // Tous identiques
      .map( (subSector: any) => subSector.name)
      .forEach( (name: string) => this.sectorSubColumns.push({ field: name.replace(' ',''), header: name }));*/

    this.sectorMainColumns = [
      {field: 'equityName', header: 'Name'},
      {field: 'amount', header: 'Amount'}
    ].concat(this.sectorMap.filter(column => column.level === 0));

    this.sectorSubColumns = [
      {field: 'equityName', header: 'Name'}
    ].concat(this.sectorMap.filter(column => column.level === 1));

    console.log(this.sectorSubColumns);

    // Ajoute le total global
    /*const totalAmount = this.sectorData
      .map(secData => secData.amount)
      .reduce((secData, next) => secData + next);

    this.sectorTotal.name = 'Total';
    this.sectorTotal.amount = totalAmount;*/
  }

  toggleRow(table: any, dto: any, event: any): void {
    console.log(table);
    console.log(dto);
    console.log(event)
  }
}
