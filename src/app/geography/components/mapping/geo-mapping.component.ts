import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Action, Geography } from 'src/app/geography/model/geography';
import { LoadingFacade } from 'src/app/handling/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { GeoMappingTableModule } from './mapping-table/geo-mapping-table.component';
import { GeoMappingFormModule } from 'src/app/geography/components/mapping/mapping-form/geo-mapping-form.component';
import { GeographyFacade, GeographyService } from '../../services/geography.service';

/**
 * Component to edit Geographies.
 *
 * ---
 *
 * Displays all Geographies in a PrimeNG Table, with creation, edition and deletion buttons.
 *
 * The table is sorted by default in alphabetical order.
 *
 * Geographies only consist of an id and name.
 * All Geographies are on the same level for now.
 *
 * The same modal handles creation and edition, the table provides the selected DTO to edit.
 * Only the Geography name can be edited, the forms only contains one value.
 * The modals updates its title and selected name according to the action selected.
 *
 * Deletion is handled through a PrimeNG Confirmation modal.
 *
 * The loader is activated for longer requests.
 */
//TODO component for modal
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geo-mapping',
  templateUrl: './geo-mapping.component.html',
  styleUrls: ['./geo-mapping.component.scss']
})
export class GeoMappingComponent implements OnInit, OnDestroy {

  private _isDead$: Subject<boolean> = new Subject(); // Used for unsubscribing to services.

  // Modal elements. Changes title and selected DTO to send.
  modalTitle: string = '';

  show: boolean = false;

  private _selectedName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedName$: Observable<string> = this._selectedName$.asObservable();

  currentAction?: Action;
  selectedGeography?: Geography;

  constructor(
    public loadingFacade: LoadingFacade,
    private confirmationService: ConfirmationService,
    private geographyService: GeographyService,
    public geographyFacade: GeographyFacade
  ) {}

  ngOnInit(): void {
    this.geographyService.get()
        .pipe(
          takeUntil(this._isDead$),
        ).subscribe();
  }

  /**
   * Called upon creation and edition. In this case contains the selected Geography DTO as parameter.
   */
  openModal(action: Action, geography?: Geography): void {

    switch(action) {

      case 'add':
        this.modalTitle = 'Create new Geography';
        this._selectedName$.next('');
        this.selectedGeography = undefined;
        this.show = true;
        break;

      case 'edit':
        if(geography) {
          this.modalTitle = 'Edit Geography';
          this.currentAction = 'edit';
          this._selectedName$.next(geography.name);
          this.selectedGeography = geography;
          this.show = true;
        }
        break;

      case 'del':
        if(geography) this.delete(geography._id);
        break;

      default:
        break;
    }
    this.currentAction = action;
  }

  onSelected([selectedGeography, action]: (Geography | Action)[]) {
    this.openModal(action as Action, selectedGeography as Geography);


  }

  onFormSubmit(event: string) {
    this.show = false;

    if(this.currentAction === 'edit') {

      if(this.selectedGeography) {

        const clone = {...this.selectedGeography};
        clone.name = event;

        this.geographyService.edit(clone)
          .pipe(
            takeUntil(this._isDead$),
          ).subscribe();
      }

    } else {
      this.geographyService.add(event)
        .pipe(
          takeUntil(this._isDead$),
        ).subscribe();
    }
  }

  delete(id: number): void {
    // Fills confirmation modal.
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this geography ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.geographyService.delete(id)
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
  declarations: [GeoMappingComponent],
  exports: [GeoMappingComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    GeoMappingFormModule,
    GeoMappingTableModule
  ],
  providers: [ConfirmationService]
})
export class GeogMappingModule {}
