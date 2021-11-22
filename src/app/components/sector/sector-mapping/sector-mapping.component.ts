import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Sector } from 'src/app/models/sector';
import { SectorService } from 'src/app/services/sector/sector.service';


/** L'arbre a 2 niveaux : secteurs et sous-secteurs */
@Component({
  selector: 'app-sector-mapping',
  templateUrl: './sector-mapping.component.html',
  styleUrls: ['./sector-mapping.component.scss']
})
export class SectorMappingComponent implements OnInit {

  name: FormControl = new FormControl('', [Validators.required]);

  selectedSector: Sector | undefined;

  modify: boolean = false; // Ouverture modal
  submitted: boolean = false; // Form validation
  dialogTitle: string = "";

  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  sectorData: TreeNode[] = [
    {
      data: {
        name: "Technology",
        _id: 1,
        level: 0
      },
      children:
      [
        {
          data: {
            name: "IT & Services",
            level: 1
          }
        },
        {
          data: {
            name: "Video Games",
            level: 1
          }
        },
        {
          data: {
            name: "Hardware & Periphericals",
            level: 1
          }
        }
      ]
    },
    {
      data: {
        name: "Real Estate",
        _id: 2,
        level: 0
      },
      children: []
    },
    {
      data: {
        name: "Industrials",
        _id: 3,
        level: 0
      },
      children:
      [
        {
          data: {
            name: "Automotive",
            level: 1
          }
        },
        {
          data: {
            name: "Contruction & Engineering",
            level: 1
          }
        }
      ]
    },
    {
      data: {
        name: "Healthcare",
        _id: 4,
        level: 0
      },
      children:
      [
        {
          data: {
            name: "Biotechnology",
            level: 1
          }
        },
        {
          data: {
            name: "Cannabis",
            level: 1
          }
        }
      ]
    }
  ];


  constructor(
    private confirmationService: ConfirmationService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.expandAll();

  }

  onSubmit(): void {

  }

  // Ne peut pas passer l'objet entier car ce sont des TreeNode. On mappe à l'id.
  openDialog(add?: boolean, id?: number): void {
    this.modify = true;
    this.submitted = false;

    if(id) { // Ajout sous-secteur ou édition

      if(add) {
        this.name.setValue(''); // Reset input
        this.dialogTitle = "Add Sub Sector";
        //this.selectedSector = sector; // Le Secteur Majeur

      } else { // Edition
        //this.name.setValue(sector.name);
        this.dialogTitle = "Edit Sector";
        //this.selectedSector = sector;
      }

    } else { // Ajout secteur majeur
      this.name.setValue(''); // Reset input
      this.dialogTitle = "Add Major Sector";
      this.selectedSector = undefined;
    }
  }

  hideDialog(): void {
    this.modify = false;
    this.submitted = false;
  }

  expandAll(){
    this.sectorData.forEach(node => {
        this.expandRecursive(node, true);
    });
    this.sectorData = [...this.sectorData]; // Use the spread operator to trigger a refresh of the table
  }

  collapseAll(){
    this.sectorData.forEach(node => {
        this.expandRecursive(node, false);
    });
    this.sectorData = [...this.sectorData];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand; // Attribut html

    if (node.children){
      node.children.forEach(childNode => {
          this.expandRecursive(childNode, isExpand);
      });
    }
  }


  /**------------------------CRUD------------------------*/

  getSectors(): void {
    this.sectorService.getSectors()
      .subscribe((data: Sector[]) => { // Subscribe will actually launch the request
        //TODO mapping
      });
  }

  editGeography(geography?: Sector): void {
    /*this.submitted = true;

    if(geography) { // Edition

      if(this.name.value !== '') {
        geography.name = this.name.value; // Met à jour le nom avec le contenu de l'input

        this.geographyService.editGeography(geography)
          .subscribe( (status: number) => {
            if(status === 200) {
              this.modify = false; // Le dialog écoute le changement d'attribut et se fermera
              // Update data property
              this.geographyList[this.findIndexFromId(geography._id)].name = geography.name;
            }
          })
      }

    } else { // Ajout nouvelle geographie
      console.log(this.name.value);
      this.geographyService.addGeography(this.name.value)
        .subscribe( (data: Geography) => {
          this.modify = false; // Le dialog écoute le changement d'attribut et se fermera
          // Update data property
          this.geographyList.push(data);
        })
    }*/
  }

  // Suppression d'un secteur principal uniquement
  deleteSector(id: string): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this sector ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.sectorService.deleteSector(id)
          .subscribe( (status: number) => {
            if(status === 200) {
              // Update data property
              //this.sectorData.splice(this.findIndexFromId(id), 1);
            }
          })
        //TODO alert message
      }
    });
  }

  //TODO TUs
  /*private findIndexFromId(id: string): number {
    const idList = this.geographyList.map(geography => geography._id);
    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }*/
}
