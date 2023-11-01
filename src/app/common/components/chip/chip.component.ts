import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { ChipModule as PrimeChipModule } from 'primeng/chip';

/**
 * Presentational chip component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {

  @Input() label = '';
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ChipComponent],
  exports: [ChipComponent],
  imports: [
    PrimeChipModule
  ]
})
export class ChipModule {}
