import { Component, Input, OnInit } from '@angular/core';

/**
 * Composant pour l'affichage des données sectorielles en table.
 *
 * - Reçoit les données au bon format (colonnes dynamiques dont le nom du secteur est le nom de propriété de l'objet).
 * - Affiche les données en table, lignes = équité, colonne = secteur, scroll horizontal.
 * - Distingue les secteurs principaux dans la table principale, et sous-secteurs dans un rowGroup (cf doc PrimeNG).
 */
@Component({
  selector: 'app-sector-exposure-table',
  templateUrl: './sector-exposure-table.component.html',
  styleUrls: ['./sector-exposure-table.component.scss']
})
export class SectorExposureTableComponent implements OnInit {

  // Prise des secteurs puis pour chaque secteur, ajout d'un objet contenant tous les noms d'equité avec leur exposure si présent, 0 sinon.
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
