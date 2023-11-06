import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { TableModule } from 'src/app/core/components/table/table.component';
import { Sector } from '../../../common/models/sector';
import { EditionService } from '../../services/edition.service';
import { SectorService } from '../../services/sector.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.component';
import { EditionModalModule } from '../edition-modal/edition-modal.component';
import { SectorTableModule } from '../sector-table/sector-table.component';

/**
 * Container component to display and edit Sectors.
 *
 * ---
 *
 * Displays all Sectors in a PrimeNG Table, with creation, edition and deletion buttons.
 *
 * The table is sorted by default in alphabetical order.
 *
 * Modelization :
 *
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
  selector: 'app-sector-view',
  templateUrl: './sector-view.component.html',
  styleUrls: ['./sector-view.component.scss']
})
export class SectorViewComponent implements OnInit {

  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  // Tree model object transmitted to the table, instead of the original DTO list.
  readonly data$: Observable<TreeNode<Sector>[]>;

  constructor(
    private _editionService: EditionService,
    private _sectorService: SectorService
  ) {
    this.data$ = this._sectorService.sectorData$();
  }

  ngOnInit(): void {
    this._sectorService.expand(true); // Opens the tree by default.
  }

  openModal(action: 'add' | 'addChild' | 'edit' | 'del'): void {
    this._editionService.openModal(action, 'sec');
  }

  expand(isExpand: boolean): void {
    this._sectorService.expand(isExpand);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SectorViewComponent],
  exports: [SectorViewComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmationModalModule,
    EditionModalModule,
    SectorTableModule,
    TableModule
  ]
})
export class SectorViewModule {}
