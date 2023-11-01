import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { ProgressSpinnerModule } from 'src/app/common/components/progress-spinner/progress-spinner.component';
import { Geography } from 'src/app/common/models/geography';
import { EditionService } from '../../services/edition.service';
import { GeographyService } from '../../services/geography.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.component';
import { EditionModalModule } from '../edition-modal/edition-modal.component';
import { GeographyTableModule } from '../geography-table/geography-table.component';

/**
 * Container component to display and edit Geographies.
 *
 * ---
 *
 * Displays all Geographies in a PrimeNG Table, with creation, edition and deletion buttons. Holds modals.
 *
 * The table is sorted by default in alphabetical order.
 *
 * Geographies only consist of an id and name.
 * All Geographies are on the same level for now.
 *
 * A single modal handles creation and edition, the table provides the selected DTO to edit.
 * Only the Geography name can be edited, the forms only contains one value.
 * The modals updates its title and selected name according to the action selected.
 *
 * Deletion is handled through a PrimeNG Confirmation modal.
 *
 * The loader is activated for longer requests.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geography-view',
  templateUrl: './geography-view.component.html',
  styleUrls: ['./geography-view.component.scss']
})
export class GeographyViewComponent implements OnInit {

  readonly data$: Observable<Geography[]>;

  constructor(
    private _editionService: EditionService,
    private _geographyService: GeographyService
  ) {
    this.data$ = this._geographyService.geographyList$;
  }

  ngOnInit(): void {
    this._geographyService.get();
  }

  openModal(action: 'add' | 'addChild' | 'edit' | 'del'): void {
    this._editionService.openModal(action, 'geo');
  }

}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [GeographyViewComponent],
  exports: [GeographyViewComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmationModalModule,
    EditionModalModule,
    GeographyTableModule,
    ProgressSpinnerModule
  ]
})
export class GeographyViewModule {}
