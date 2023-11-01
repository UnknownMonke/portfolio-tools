import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { ProgressSpinnerModule as PrimeProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Presentational progress spinner component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html'
})
export class ProgressSpinnerComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ProgressSpinnerComponent],
  exports: [ProgressSpinnerComponent],
  imports: [
    PrimeProgressSpinnerModule
  ]
})
export class ProgressSpinnerModule {}
