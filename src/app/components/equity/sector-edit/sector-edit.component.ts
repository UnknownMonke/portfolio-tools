import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Sector } from 'src/app/models/sector';
import { SectorExposition } from 'src/app/models/sectorExposition';
import { SectorService } from 'src/app/services/sector/sector.service';


@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html',
  styleUrls: ['./sector-edit.component.scss']
})
export class SectorEditComponent implements OnInit {

  sectorTree: TreeNode[] = [];

  @Output() sectorRepartitionChange = new EventEmitter<any>();

  constructor(
    private sectorService: SectorService,
  ) {}

  ngOnInit(): void {}

  // Rempli la liste des secteurs avec les valeurs mappées en base et non les valeurs concaténées des equités
  fillExposition(sectorRepartition: SectorExposition[]): void {
    this.sectorService.getSectors()
      .subscribe( (data: Sector[]) => {

        if(data.length > 0) {

          const defaultSectors = data
            .map(sector => {
              return {
                sector: sector,
                exposure: 0
              };
            });

          // Edite la liste des repartitions avec les valeurs trouvées dans les équités
          if(sectorRepartition.length > 0) {

            defaultSectors.forEach(repartition => {
              const correspondingExpoMap = sectorRepartition
                .filter(expo => expo.sector._id === repartition.sector._id);

              if(correspondingExpoMap.length > 0) {
                repartition.exposure = correspondingExpoMap[0].exposure;
              }
            });
          }
          sectorRepartition = defaultSectors;

          this.sectorTree = this.buildTree(sectorRepartition);
          console.log(this.sectorTree);

          this.expandAll();

        } else {
          //TODO error message
        }
      });
  }

  // Convertit la liste aplatie des secteurs en arbre pour affichage
  private buildTree(sectorRepartition: SectorExposition[]): TreeNode[] {
    const hashTable = Object.create(null);

    sectorRepartition.forEach(repartition => hashTable[repartition.sector._id] = {
      data: repartition,
      children: []
    });
    const dataTree: TreeNode[] = [];

    sectorRepartition.forEach(repartition => {

      if(repartition.sector.parentId > -1) {
        hashTable[repartition.sector.parentId].children.push(hashTable[repartition.sector._id]);
      } else {
        dataTree.push(hashTable[repartition.sector._id]);
      }
    });
    return dataTree;
  }

  expandAll(){
    this.sectorTree.forEach(node => {
        this.expandRecursive(node, true);
    });
    this.sectorTree = [...this.sectorTree]; // Use the spread operator to trigger a refresh of the table
  }

  collapseAll(){
    this.sectorTree.forEach(node => {
        this.expandRecursive(node, false);
    });
    this.sectorTree = [...this.sectorTree];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand; // Attribut html

    if (node.children){
      node.children.forEach(childNode => {
          this.expandRecursive(childNode, isExpand);
      });
    }
  }

  // Reconverti l'arbre en array, et emit pour sauvegarde
  //TODO TU
  submitRepartition(): void {
    const sectorRepartition: SectorExposition[] = [];
    this.mapTreeEmitter(sectorRepartition, this.sectorTree);
    this.sectorRepartitionChange.emit(sectorRepartition);
  }

  private mapTreeEmitter(sectorRepartition: SectorExposition[], tree: TreeNode[]): void {
    tree.forEach(repartition => {
      sectorRepartition.push(repartition.data);

      if(repartition.children && repartition.children.length > 0) {
        this.mapTreeEmitter(sectorRepartition, repartition.children);
      }
    });
  }
}
