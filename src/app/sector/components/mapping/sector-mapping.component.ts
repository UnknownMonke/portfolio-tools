import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Action, Sector } from '../../model/sector';
import { LoadingFacade } from 'src/app/handling/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SectorMappingTableModule } from './mapping-table/sector-mapping-table.component';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { SectorFacade, SectorService } from '../../services/sector.service';
import { SectorMappingFormModule } from './mapping-form/sector-mapping-form.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sector-mapping',
  templateUrl: './sector-mapping.component.html',
  styleUrls: ['./sector-mapping.component.scss']
})
export class SectorMappingComponent implements OnInit {

  private _isDead$: Subject<boolean> = new Subject(); // Used for unsubscribing to services.

  // Modal elements. Changes title and selected DTO to send.
  modalTitle: string = '';

  show: boolean = false; // Shows modal.

  // Keeps track of whether or not we are editing an existing Sector or adding a new one.
  edition: boolean = false;

  currentAction?: Action;
  selectedSector?: Sector;

  private _selectedName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedName$: Observable<string> = this._selectedName$.asObservable();


  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  // Tree model object transmitted to the table, instead of the original DTO list.
  sectorData: TreeNode<Sector>[] = [];

  constructor(
    public loadingFacade: LoadingFacade,
    private confirmationService: ConfirmationService,
    private sectorService: SectorService,
    public sectorFacade: SectorFacade
  ) {}

  ngOnInit(): void {
    this.sectorService.get()
        .pipe(
          takeUntil(this._isDead$),
        ).subscribe();

    this.sectorFacade.expandAll(); // Opens the tree by default.
  }

  /**
   * Called upon creation and edition.
   * If edit, contains the Sector to edit, else contains nothing if the Sector is a major Sector (top level),
   * or contains the parent Sector to add to.
   *
   * @param edit true if we are editing a Sector.
   * @param {Sector} sector the Sector to edit, or the parent of the Sector to create in case of a sub-level one.
   */
  openModal(action: Action, sector?: Sector): void {

    switch(action) {

      case 'add':
        this.modalTitle = 'Add Major Sector';
        this._selectedName$.next('');
        this.selectedSector = undefined;
        this.show = true;
        break;

      case 'addChild':

        if(sector) {
          this.modalTitle = 'Add Sub Sector';
          this._selectedName$.next('');
          this.selectedSector = sector;
          this.show = true;
        }
        break;

      case 'edit':
        if(sector) {
          this.modalTitle = 'Edit Sector';
          this._selectedName$.next(sector.name);
          this.selectedSector = sector;
          this.show = true;
        }
        break;

      case 'del':
        if(sector) this.delete(sector._id);
        break;

      default:
        break;
    }
    this.currentAction = action;
  }

  onSelected([selectedSector, action]: (Sector | Action)[]) {
    this.openModal(action as Action, selectedSector as Sector);
  }

  onFormSubmit(event: string) {
    this.show = false;


    if(this.currentAction === 'add') {
      this.sectorService.add(event)
        .pipe(
          takeUntil(this._isDead$),
        ).subscribe();

    } else if(this.currentAction === 'addChild') {

      if(this.selectedSector) {
        this.sectorService.add(event, this.selectedSector)
        .pipe(
          takeUntil(this._isDead$),
        ).subscribe();
      }

    } else if(this.currentAction === 'edit') {

      if(this.selectedSector) {

        const clone = {...this.selectedSector};
        clone.name = event;

        this.sectorService.edit(clone)
          .pipe(
            takeUntil(this._isDead$),
          ).subscribe();
      }
    }
  }

  delete(id: number): void {
    // Fills confirmation modal.
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this sector ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.sectorService.delete(id)
          .pipe(
            takeUntil(this._isDead$),
          ).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this._isDead$.next(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SectorMappingComponent],
  exports: [SectorMappingComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    SectorMappingTableModule,
    SectorMappingFormModule
  ],
  providers: [ConfirmationService]
})
export class SectorMappingModule {}
