import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreeTableModule } from 'primeng/treetable';
import { Sector, SectorExposure } from 'src/app/common/models/sector';
import { SectorApiService } from 'src/app/edition/services/sector.provider';

/**
 * Composant pour l'édition de la répartition sectorielle d'une équité.
 *
 * - Récupère la répartition actuelle en input.
 * - Récupère la liste des secteurs en base et ajoute l'exposure si trouvée dans la répartition actuelle de l'équité,
 *   pour être à jour (ajout à 0 pour un secteur nouvellement ajouté).
 * - Emet le résultat de la form en output.
 */
@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html',
  styleUrls: ['./sector-edit.component.scss']
})
export class SectorEditComponent implements OnInit {

  sectorTree: TreeNode[] = [];

  @Output() sectorRepartitionChange = new EventEmitter<any>();

  constructor(
    private sectorService: SectorApiService,
  ) {}

  ngOnInit(): void {}

  // Rempli la liste des secteurs avec les valeurs mappées en base et non les valeurs concaténées des equités.
  fillExposure(sectorRepartition: SectorExposure[]): void {
    this.sectorService.get()
      .subscribe( (data: Sector[]) => {

        if(data.length > 0) {

          const defaultSectors = data
            .map(sector => {
              return {
                sector: sector,
                exposure: 0
              };
            });

          // Edite la liste des repartitions avec les valeurs trouvées dans les équités.
          if(sectorRepartition.length > 0) {

            defaultSectors.forEach(repartition => {
              const correspondingExpoMap = sectorRepartition
                .filter(expo => 0);

              if(correspondingExpoMap.length > 0) {
                repartition.exposure = correspondingExpoMap[0].exposure;
              }
            });
          }
          //sectorRepartition = defaultSectors;

          this.sectorTree = this.buildTree(sectorRepartition);

          this.expandAll();

        } else {
          //TODO error message
        }
      });
  }

  // Convertit la liste aplatie des secteurs en arbre pour affichage.
  private buildTree(sectorRepartition: SectorExposure[]): TreeNode[] {
    const hashTable = Object.create(null);

    sectorRepartition.forEach(repartition => hashTable[0] = {
      data: repartition,
      children: []
    });
    const dataTree: TreeNode[] = [];

    /*sectorRepartition.forEach(repartition => {

      if(repartition.sector.parentId > -1) {
        hashTable[repartition.sector.parentId].children.push(hashTable[repartition.sector._id]);
      } else {
        dataTree.push(hashTable[repartition.sector._id]);
      }
    });*/
    return dataTree;
  }

  expandAll(){
    this.sectorTree.forEach(node => {
        this.expandRecursive(node, true);
    });
    this.sectorTree = [...this.sectorTree]; // Use the spread operator to trigger a refresh of the table.
  }

  collapseAll(){
    this.sectorTree.forEach(node => {
        this.expandRecursive(node, false);
    });
    this.sectorTree = [...this.sectorTree];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand; // Attribut html.

    if (node.children){
      node.children.forEach(childNode => {
          this.expandRecursive(childNode, isExpand);
      });
    }
  }

  // Reconverti l'arbre en array, et emit pour sauvegarde.
  //TODO TU
  submitRepartition(): void {
    const sectorRepartition: SectorExposure[] = [];

    this.mapTreeEmitter(sectorRepartition, this.sectorTree);
    this.sectorRepartitionChange.emit(sectorRepartition);
  }

  private mapTreeEmitter(sectorRepartition: SectorExposure[], tree: TreeNode[]): void {
    tree.forEach(repartition => {
      sectorRepartition.push(repartition.data);

      if(repartition.children && repartition.children.length > 0) {
        this.mapTreeEmitter(sectorRepartition, repartition.children);
      }
    });
  }
}

@NgModule({
  declarations: [SectorEditComponent],
  exports: [SectorEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    TreeTableModule,
    InputNumberModule
  ],
})
export class SectorEditModule {}
