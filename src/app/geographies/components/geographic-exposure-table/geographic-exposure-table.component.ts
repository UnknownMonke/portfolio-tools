import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

/**
 * Composant pour l'affichage des données géographiques en table.
 *
 * - Reçoit les données au bon format (colonnes dynamiques dont le nom de la géographie est le nom de propriété de l'objet).
 * - Affiche les données en table, lignes = équité, colonne = secteur géographique, scroll horizontal.
 */
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

  /**
   * Construit les colonnes dynamiques depuis la map.
   * PrimeNG demande un objet colonne séparé pour les tables dynamiques (de type field / header name).
   * Le champ "field" est utilisé pour accéder à la donnée, il doit être identique au nom de la propriété du DTO.
   */
  private setColumns(): void {
    this.geographicColumns = [
      {field: 'name', header: 'Name'},
      {field: 'amount', header: 'Amount'}
    ];
    this.regionMap.forEach(region => this.geographicColumns.push(region));

    // Ajoute le total global.
    const totalAmount = this.geographicData
      .map(geoData => geoData.amount)
      .reduce((geoData, next) => geoData + next);

    this.geographicTotal.name = 'Total';
    this.geographicTotal.amount = totalAmount;
  }
}

@NgModule({
  declarations: [GeographicExposureTableComponent],
  exports: [GeographicExposureTableComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule
  ]
})
export class GeographicExposureTableModule {}
