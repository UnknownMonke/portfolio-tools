import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { Sector } from 'src/app/sector/model/sector';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sector-mapping-table',
  templateUrl: './sector-mapping-table.component.html',
  styleUrls: ['./sector-mapping-table.component.scss']
})
export class SectorMappingTableComponent {

  @Input()
  sectorData: TreeNode<Sector>[] | null = [];

  @Output()
  sectorSubmit = new EventEmitter<(Sector | 'addChild' | 'edit' | 'del')[]>();

  addChild(sector: Sector): void {
    this.sectorSubmit.emit([sector, 'addChild']);
  }

  edit(sector: Sector): void {
    this.sectorSubmit.emit([sector, 'edit']);
  }

  del(sector: Sector): void {
    this.sectorSubmit.emit([sector, 'del']);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SectorMappingTableComponent],
  exports: [SectorMappingTableComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TreeTableModule
  ]
})
export class SectorMappingTableModule {}
