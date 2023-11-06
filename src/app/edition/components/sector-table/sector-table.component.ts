import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { Sector } from 'src/app/common/models/sector';
import { EditionService } from '../../services/edition.service';
import { SectorService } from '../../services/sector.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sector-table',
  templateUrl: './sector-table.component.html',
  styleUrls: ['./sector-table.component.scss']
})
export class SectorTableComponent {

  @Input() data: TreeNode<Sector>[] = [];

  constructor(
    private _editionService: EditionService,
    private _sectorService: SectorService
  ) {}

  openModal(sector: Sector, action: 'add' | 'addChild' | 'edit' | 'del'): void {
    this._editionService.openModal(action, 'sec', sector);
  }

  onExpandChange(event: any): void {
    this._sectorService.onExpandChange(event.node);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SectorTableComponent],
  exports: [SectorTableComponent],
  imports: [
    CommonModule,
    TreeTableModule,
    ButtonModule
  ]
})
export class SectorTableModule {}
