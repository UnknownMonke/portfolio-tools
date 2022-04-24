import { Component, NgModule, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Sector } from '../../model/sector';
import { LoadingService } from 'src/app/handling/services/loading/loading.service';
import { SectorService } from '../../service/sector.service';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Component to edit Sectors.
 *
 * ---
 *
 * Displays all Sectors in a PrimeNG Table, with creation, edition and deletion buttons.
 *
 * The table is sorted by default in alphabetical order.
 *
 * Modelization :
 * - Sectors are modelized in a tree with 2 levels : Main Sectors and Sub Sectors.
 * - More levels are possible, but for now Sectors follow the `S&P 500 model` (Sectors names are roughly the same).
 * - The PrimeNG TreeTable component is used to generate sub categories with togglers, using a TreeNode structure (see below).
 * - Sectors consists of an id, a name, a level to track their position in the tree and the id of the parent (which is negative for top level nodes).
 * - Sectors level and parent cannot be directly updated : the Sector must be deleted and created again.
 *
 * The same modal handles creation and edition, the table provides the selected DTO to edit.
 * Only the Sector name can be edited, the forms only contains one value.
 * The modals updates its title and selected name according to the action and level selected.
 *
 * Deletion is handled through a PrimeNG Confirmation modal.
 *
 * The loader is activated for longer requests.
 */
@Component({
  selector: 'app-sector-mapping',
  templateUrl: './sector-mapping.component.html',
  styleUrls: ['./sector-mapping.component.scss']
})
export class SectorMappingComponent implements OnInit {

  // Modal elements. Changes title and selected DTO to send.
  modalTitle: string = '';
  show: boolean = false; // Shows modal.
  submitted: boolean = false; // Form validation.
  // Keeps track of whether or not we are editing an existing Sector or adding a new one.
  edition: boolean = false;

  // Using Angular template forms.
  name: FormControl = new FormControl('', [Validators.required]);
  selectedSector: Sector | undefined;

  // DTO list.
  private sectorList: Sector[] = [];

  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  // Tree model object transmitted to the table, instead of the original DTO list.
  sectorData: TreeNode<Sector>[] = [];

  constructor(
    public loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.getSectors(); // Loads Sector list on init.
    this.expandAll(); // Opens the tree by default.
  }

  /**
   * Called upon creation and edition.
   * If edit, contains the Sector to edit, else contains nothing if the Sector is a major Sector (top level),
   * or contains the parent Sector to add to.
   *
   * @param edit true if we are editing a Sector.
   * @param {Sector} sector the Sector to edit, or the parent of the Sector to create in case of a sub-level one.
   */
  openModal(edit: boolean, sector?: Sector): void {
    this.show = true;
    this.submitted = false;

    if(edit) { // Edition.

      this.name.setValue(sector?.name); // Updates form input value.
      this.modalTitle = "Edit Sector";
      this.selectedSector = sector;

    } else { // Creation.

      if(sector) { // Adding sub Sector, 'sector' is the parent.
        this.name.setValue(''); // Resets form input from previous openings.
        this.modalTitle = "Add Sub Sector";
        this.selectedSector = sector;

      } else { // Adding major Sector.
        this.name.setValue('');
        this.modalTitle = "Add Major Sector";
        this.selectedSector = undefined
      }
    }
    this.edition = edit;
  }

  hideModal(): void {
    this.show = this.submitted = this.edition = false;
  }

  /**
   * Expands the tree by changing the 'expanded' attribute recursively.
   */
  expandAll(){
    this.sectorData.forEach(node => {
      this.expandRecursive(node, true);
    });
    this.sectorData = [...this.sectorData]; // Uses the spread operator to trigger a refresh of the table with sorts and filters.
  }

  /**
   * Collapses the tree by changing the 'expanded' attribute recursively.
   */
  collapseAll(){
    this.sectorData.forEach(node => {
      this.expandRecursive(node, false);
    });
    this.sectorData = [...this.sectorData];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand;

    if(node.children){
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /** ---------------------- CRUD ---------------------- */

  getSectors(): void {
    this.sectorService.get()
      .subscribe( (data: Sector[]) => { // Subscribing will actually launch the request.
        this.sectorList = data;
        this.generateNodeList();
      });
  }

  /**
   * Adds a new sector linked to its parent if exists (top level Sector does not have any).
   *
   * Upon requests success, the new Sector DTO is returned (with the id) and added to the DTO list.
   *
   * @param parent the parent node of the new Sector. Can be undefined if the Sector is at the top level.
   */
  addSector(parent?: Sector): void {
    this.submitted = true;
    this.show = false; // Closes modal before request.

    if(this.name.value && this.name.value !== '') {

      // Not a Sector DTO object as id is generated server-side.
      const newSector: any = {
        name: this.name.value,
        level: parent ? parent.level + 1 : 0, // If parent exists, makes it children by increasing the level.
        parentId: parent ? parent._id : -1 // Refers parent id to be able to link afterward.
      };

      this.sectorService.add(newSector)
        .subscribe( (data: Sector) => {
          // Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
          this.sectorList.push(data);
          this.generateNodeList(); // Choice is made to regenerate each time rather than editing the TreeNode object itself.

          // Displays toast popup to confirm action success.
          this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
        });
    }
  }

  /**
   * Edits an existing Sector name.
   *
   * @param sector selected Sector, always defined but type checked nonetheless.
   */
  editSector(sector?: Sector): void {
    this.submitted = true;
    this.show = false;

    if(this.name.value && this.name.value !== '' && sector) {

      // Clones the parameter to avoid updating it in the table before request success, as it's an underlying component property.
      const clone = {...sector};
      // Updates the clone with the form value.
      clone.name = this.name.value;

      this.sectorService.edit(sector)
        .subscribe( (success: boolean) => {
          if(success) {
            // Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
            this.sectorList[this.findIndexFromId(sector._id)].name = this.name.value;
            this.generateNodeList();

            this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
          }
        });
    }
  }

  deleteSector(id: number): void {
    // Fills confirmation modal.
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this sector ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.sectorService.delete(id)
          .subscribe( (success: boolean) => {
            if(success) {
              /*
              Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
              The targeted Sector and all its sub Sectors are removed to keep the DTO list clean despite removing sub Sector not being
              necessary as regenerating the tree will automatically ignore orphan Sectors.
              */
              this.sectorList = this.sectorList.filter(sector => sector._id !== id && sector.parentId !== id);
              this.generateNodeList();

              this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
            }
          });
      }
    });
  }

  /** -------------------------------------------------- */

  /**
   * Converts the DTO array into an array of TreeNode as per PrimeNG TreeTable component requirements (see doc).
   */
  private generateNodeList(): void {
    const treeNodeData: TreeNode<Sector>[] = [];

    this.sectorList
      .filter(sector => sector.level === 0)
      .forEach(sector => {
        // Searches for the current stored main node to maintain the expanded status if exists.
        const existingNode = this.findNode(sector._id);

        treeNodeData.push(
          {
            data: sector,
            expanded: existingNode ? existingNode.expanded : true,
            children: []
          }
        );
      });

    treeNodeData.forEach(node =>
      this.sectorList
        .filter(sector => sector.parentId === node.data?._id)
        .forEach(subsector => {
          // Searches for the current stored sub node to maintain the expanded status if exists, by finding the main node first and searching tthe children.
          const existingNode = this.findNode(subsector.parentId);
          const existingSubNode = existingNode ? existingNode.children?.filter(subNode => subNode.data?._id === subsector._id) : null;

          node.children?.push(
            {
              data: subsector,
              expanded: existingSubNode && existingSubNode.length > 0 ? existingSubNode[0].expanded : true
            }
          );
        })
      );
    this.sectorData = [...treeNodeData]; // Uses the spread operator to trigger a refresh of the table with sorts and filters.
  }

  //TODO TUs
  private findIndexFromId(id: number): number {
    const idList = this.sectorList.map(sector => sector._id);

    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }

  /**
   * Finds a node in the tree.
   */
  private findNode(nodeId: number): TreeNode<Sector> | null {
    const filter = this.sectorData.filter(node => node.data?._id === nodeId);

    return filter && filter.length > 0 ? filter[0] : null;
  }
}

@NgModule({
  declarations: [SectorMappingComponent],
  exports: [SectorMappingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    TreeTableModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class SectorMappingModule {}
