import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Action, Geography } from 'src/app/geography/model/geography';

/**
 *
 */
//TODO implement lazy loading for portfolio table
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geo-mapping-table',
  templateUrl: './geo-mapping-table.component.html',
  styleUrls: ['./geo-mapping-table.component.scss']
})
export class GeoMappingTableComponent {

  @Input()
  geographyList: Geography[] | null = [];

  @Output()
  geographySubmit = new EventEmitter<(Geography | Action)[]>();

  edit(geography: Geography): void {
    this.geographySubmit.emit([geography, 'edit']);
  }

  del(geography: Geography): void {
    this.geographySubmit.emit([geography, 'del']);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [GeoMappingTableComponent],
  exports: [GeoMappingTableComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule
  ]
})
export class GeoMappingTableModule {}
