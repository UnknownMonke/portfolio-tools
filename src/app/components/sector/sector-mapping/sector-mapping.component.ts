import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Sector } from 'src/app/models/sector';
import { SectorService } from 'src/app/services/sector/sector.service';
import { LoadingService } from 'src/app/services/handling/loading/loading.service';

/**
 * Composant pour l'édition des secteurs.
 *
 * - Utilise les Reactive Forms.
 * - Affiche sous forme de treeTable éditable (PrimeNG), via popup puis CRUD.
 * ---
 * L'arbre a 2 niveaux : secteurs principaux et sous-secteurs (modélisation S&P 500 classique).
 */
@Component({
  selector: 'app-sector-mapping',
  templateUrl: './sector-mapping.component.html',
  styleUrls: ['./sector-mapping.component.scss']
})
export class SectorMappingComponent implements OnInit {

  name: FormControl = new FormControl('', [Validators.required]);

  selectedSector: Sector | undefined;

  modify: boolean = false; // Ouverture modal.
  submitted: boolean = false; // Form validation.
  edition: boolean = false;
  dialogTitle: string = "";
  sectorList: Sector[] = [];

  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  sectorData: TreeNode<Sector>[] = [];

  constructor(
    public loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.getSectors();
    this.expandAll(); // Tout ouvert par défaut.
  }

  openDialog(add?: boolean, rowData?: Sector): void {
    this.modify = true;
    this.submitted = false;

    if(rowData) { // Ajout sous-secteur ou édition.
      this.selectedSector = rowData;

      if(add) {
        this.name.setValue(''); // Reset input.
        this.dialogTitle = "Add Sub Sector";

      } else { // Edition.
        this.name.setValue(rowData.name);
        this.dialogTitle = "Edit Sector";
        this.edition = true;
      }

    } else { // Ajout secteur majeur.
      this.name.setValue(''); // Reset input.
      this.dialogTitle = "Add Major Sector";
      this.selectedSector = undefined // Reset.
    }
  }

  hideDialog(): void {
    this.modify = false;
    this.submitted = false;
    this.edition = false;
  }

  expandAll(){
    this.sectorData.forEach(node => {
      this.expandRecursive(node, true);
    });
    this.sectorData = [...this.sectorData]; // Use the spread operator to trigger a refresh of the table.
  }

  collapseAll(){
    this.sectorData.forEach(node => {
      this.expandRecursive(node, false);
    });
    this.sectorData = [...this.sectorData];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand; // Attribut html.

    if (node.children){
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /**------------------------CRUD------------------------*/
  getSectors(): void {
    this.sectorService.getSectors()
      .subscribe( (data: Sector[]) => { // Subscribe will actually launch the request.
        this.sectorList = data;
        this.generateNodeList();
      });
  }

  editSector(sector?: Sector): void {
    this.submitted = true;

    if(sector) { // Edition ou ajout sous-secteur.

      if(this.edition) {
        sector.name = this.name.value; // Met à jour le nom avec le contenu de l'input.

        this.sectorService.editSector(sector)
          .subscribe( (status: number) => {
            if(status === 200) {
              this.modify = false;
              // Update data property.
              this.sectorList[this.findIndexFromId(sector._id)].name = sector.name;
              this.generateNodeList();
            }
          });
      } else {
        this.sectorService.addSubSector(sector, this.name.value)
          .subscribe( (data: Sector) => {
            this.modify = false; // Le dialog écoute le changement d'attribut et se fermera.
            // Update data property.
            this.sectorList.push(data);
            this.generateNodeList();
          });
      }
    } else { // Ajout secteur majeur
      this.sectorService.addSector(this.name.value)
        .subscribe( (data: Sector) => {
          this.modify = false; // Le dialog écoute le changement d'attribut et se fermera.
          // Update data property.
          this.sectorList.push(data);
          this.generateNodeList();
        });
    }
  }

  deleteSector(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this sector ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.sectorService.deleteSector(id)
          .subscribe( (status: number) => {
            if(status === 200) {
              // Update data property.
              this.sectorList.splice(this.findIndexFromId(id), 1);
              this.generateNodeList();
            }
          });
        //TODO alert message
      }
    });
  }

  //TODO TUs
  private findIndexFromId(id: number): number {
    const idList = this.sectorList.map(sector => sector._id);
    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }

  private generateNodeList(): void {
    const treeNodeData: TreeNode<Sector>[] = [];

    this.sectorList
      .filter(sector => sector.level === 0)
      .forEach(sector => treeNodeData.push({
        data: sector,
        expanded: true,
        children: []
      }));

    treeNodeData.forEach(node =>
      this.sectorList
        .filter(sector => sector.parentId === node.data?._id)
        .forEach(subsector => node.children?.push({
          data: subsector,
          expanded: true
        }))
      );
    this.sectorData = [...treeNodeData]; // Force la maj du composant.
  }
}
