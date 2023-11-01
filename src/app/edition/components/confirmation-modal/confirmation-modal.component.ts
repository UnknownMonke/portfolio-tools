import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

/**
 * Presentational component to hold the PrimeNG confirmation dialog.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ConfirmationModalComponent],
  exports: [ConfirmationModalComponent],
  imports: [
    ConfirmDialogModule
  ]
})
export class ConfirmationModalModule {}
