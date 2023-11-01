import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { Geography } from 'src/app/common/models/geography';
import { EditionService } from '../../services/edition.service';

/**
 * Container component to display the geographies in a table.
 *
 * ---
 *
 * Encapsulates the PrimeNG table with all config.
 *
 * Contains buttons to edit and delete a specific geography.
 * Only displays the data and dispatch the order to open the modal for edition and deletion.
 */
//TODO implement lazy loading for portfolio table
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geo-table',
  templateUrl: './geography-table.component.html',
  styleUrls: ['./geography-table.component.scss']
})
export class GeographyTableComponent {

  @Input() data: Geography[] | null = [];

  constructor(
    private _editionService: EditionService
  ) {}

  openModal(geography: Geography, action: 'add' | 'addChild' | 'edit' | 'del'): void {
    this._editionService.openModal(action, 'geo', geography);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [GeographyTableComponent],
  exports: [GeographyTableComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule
  ]
})
export class GeographyTableModule {}
