import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy } from "@angular/core";
import { DialogModule } from 'primeng/dialog';
import { Observable, Subject, distinctUntilChanged, takeUntil } from "rxjs";
import { EditionService, ModalData } from "../../services/edition.service";
import { EditionFormModule } from "../edition-form/edition-form.component";

/**
 * Container component to handle the CRUD modal for Geographies & Sector edition.
 *
 * ---
 *
 * Contains :
 *
 * - The modal structure (PrimeNG component).
 * - The form & form fields (sub-component).
 *
 * ---
 *
 * The PrimeNG Dialog component uses 2-way binding for the visible property.
 * As such, the property cannot directly subscribe to an observable, and must use a component variable instead.
 * We then need to resort to subscribing inside the component and handling the unsubscription ourselves.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edition-modal',
  templateUrl: './edition-modal.component.html'
})
export class EditionModalComponent implements OnDestroy {

  private _isDead$ = new Subject<boolean>();

  show = false;

  readonly data$: Observable<ModalData>;

  constructor(
    private _editionService: EditionService
  ) {
    this._editionService.modalShow$
      .pipe(
        takeUntil(this._isDead$),
        distinctUntilChanged()
      ).subscribe(val => this.show = val);

    this.data$ = this._editionService.modalData$;
  }

  /**
   * Hack to update the visible state in the editionService when clicking on the close icon, or the backgorund mask.
   * The click event cannot be directly accessed so the state must be manually updated.
   *
   * DistinctUntilChanged is used in the state to prevent redundant dispatches.
   */
  visibleChange(event: boolean): void {
    this._editionService.show(event);
  }

  ngOnDestroy(): void {
    this._isDead$.next(true);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [EditionModalComponent],
  exports: [EditionModalComponent],
  imports: [
    CommonModule,
    DialogModule,
    EditionFormModule
  ]
})
export class EditionModalModule {}
