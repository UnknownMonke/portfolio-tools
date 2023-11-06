import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { ButtonModule as PrimeButtonModule } from 'primeng/button';

/**
 * Presentational button component.
 *
 * ---
 *
 * Encapsulates the PrimeNG button component.
 *
 * All inputs are replicated.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {

  @Input() label? = '';
  @Input() btnClass? = ''; // Different name to be able to use custom css classes on the component itself.
  @Input() icon? = '';
  @Input() type? = 'button';
  @Input() height? = '';
  @Input() width? = '';

  @Input() disabled? = false;
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ButtonComponent],
  exports: [ButtonComponent],
  imports: [
    PrimeButtonModule
  ]
})
export class ButtonModule {}
